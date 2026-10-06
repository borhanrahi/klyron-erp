import time

from fastapi import Request
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware

# ponytail: in-process GET cache. TTL 30s + clear-on-write covers a single-process
# uvicorn. If multi-worker/multi-instance ever happens, move to Redis instead.
_cache: dict[str, tuple[float, bytes, str]] = {}
_MAX_ENTRIES = 300
_TTL = 30.0


class ResponseCacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method != "GET":
            response = await call_next(request)
            # ponytail: coarse invalidation — any successful write clears everything,
            # so lists never stay stale past one mutation. Per-user keys if it matters.
            if response.status_code < 300:
                _cache.clear()
            return response

        key = request.headers.get("authorization", "") + "|" + str(request.url)
        hit = _cache.get(key)
        if hit is not None:
            expires, body, media_type = hit
            if expires > time.time():
                return Response(content=body, media_type=media_type)
            del _cache[key]

        response = await call_next(request)
        if (
            response.status_code == 200
            and "application/json" in response.headers.get("content-type", "")
        ):
            body = b"".join([chunk async for chunk in response.body_iterator])
            if 0 < len(body) < 512_000:
                if len(_cache) >= _MAX_ENTRIES:
                    _cache.pop(next(iter(_cache)))  # oldest entry (insertion order)
                _cache[key] = (time.time() + _TTL, body, "application/json")
            return Response(content=body, media_type="application/json")
        return response
