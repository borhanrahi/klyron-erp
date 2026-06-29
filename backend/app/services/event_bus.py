"""
Event Bus — Simple in-process pub/sub for cross-module communication.

Usage:
    from app.services.event_bus import event_bus

    # Subscribe in service init
    event_bus.on("sale.completed", handle_sale_completed)

    # Emit from router
    await event_bus.emit("sale.completed", sale_id=1, company_id=1)
"""

import asyncio
import logging
from typing import Any, Callable, Coroutine

logger = logging.getLogger("event_bus")


EventHandler = Callable[..., Coroutine[Any, Any, None]]


class EventBus:
    """Lightweight async event emitter / listener."""

    def __init__(self) -> None:
        self._handlers: dict[str, list[EventHandler]] = {}

    def on(self, event: str, handler: EventHandler) -> None:
        """Register an async handler for an event name."""
        self._handlers.setdefault(event, []).append(handler)

    def off(self, event: str, handler: EventHandler) -> None:
        """Remove a specific handler."""
        handlers = self._handlers.get(event, [])
        if handler in handlers:
            handlers.remove(handler)

    async def emit(self, event: str, **data: Any) -> None:
        """Fire an event and await all registered handlers."""
        handlers = self._handlers.get(event, [])
        if not handlers:
            return
        logger.debug("Emitting event '%s' with %s handlers", event, len(handlers))
        results = await asyncio.gather(
            *[handler(**data) for handler in handlers],
            return_exceptions=True,
        )
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(
                    "Handler %s for event '%s' failed: %s",
                    handlers[i].__name__, event, result,
                )

    def clear(self) -> None:
        """Remove all handlers (useful in tests)."""
        self._handlers.clear()


# Singleton instance
event_bus = EventBus()
