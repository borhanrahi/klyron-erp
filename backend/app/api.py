from fastapi import APIRouter

from app.routers.auth import router as auth_router
from app.routers.finance import router as finance_router
from app.routers.hr import router as hr_router
from app.routers.inventory import router as inventory_router
from app.routers.procurement import router as procurement_router
from app.routers.sales import router as sales_router
from app.routers.pos import router as pos_router
from app.routers.project import router as project_router
from app.routers.support import router as support_router
from app.routers.admin import router as admin_router
from app.routers.subscription import router as subscription_router
from app.routers.workflow import router as workflow_router
from app.routers.master_data import router as master_data_router
from app.routers.portal import router as portal_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(finance_router)
api_router.include_router(hr_router)
api_router.include_router(inventory_router)
api_router.include_router(procurement_router)
api_router.include_router(sales_router)
api_router.include_router(pos_router)
api_router.include_router(project_router)
api_router.include_router(support_router)
api_router.include_router(admin_router)
api_router.include_router(subscription_router)
api_router.include_router(workflow_router)
api_router.include_router(master_data_router)
api_router.include_router(portal_router)
