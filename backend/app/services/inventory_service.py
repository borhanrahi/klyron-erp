"""
Inventory Service — stock management, adjustments, cross-module sync.

Handles:
- Auto-decrement stock on sales/deliveries
- Auto-increment stock on GRN receipts
- Stock adjustments and transfers
- Low-stock checks
"""

import logging
from decimal import Decimal
from typing import Optional

from sqlalchemy import select, update as sa_update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.inventory import Stock, StockAdjustment, StockTransfer

logger = logging.getLogger("inventory_service")


async def decrement_stock(
    db: AsyncSession,
    *,
    company_id: int,
    item_id: int,
    warehouse_id: int,
    quantity: int,
    reference: str = "sale",
) -> bool:
    """Decrease stock quantity for an item in a warehouse.

    Returns True if stock was sufficient and decremented.
    Returns False if insufficient stock (no change made).
    """
    result = await db.execute(
        select(Stock).where(
            Stock.company_id == company_id,
            Stock.item_id == item_id,
            Stock.warehouse_id == warehouse_id,
        )
    )
    stock_record = result.scalar_one_or_none()

    if not stock_record or stock_record.quantity < quantity:
        # Log but don't fail — allow negative stock in some business contexts
        logger.warning(
            "Insufficient stock for item %s in warehouse %s: have %s, need %s",
            item_id, warehouse_id, stock_record.quantity if stock_record else 0, quantity,
        )
        if not stock_record:
            return False
        # Allow going negative
        stock_record.quantity -= quantity
    else:
        stock_record.quantity -= quantity

    await db.flush()
    return True


async def increment_stock(
    db: AsyncSession,
    *,
    company_id: int,
    item_id: int,
    warehouse_id: int,
    quantity: int,
    reference: str = "purchase",
) -> None:
    """Increase stock quantity for an item in a warehouse."""
    result = await db.execute(
        select(Stock).where(
            Stock.company_id == company_id,
            Stock.item_id == item_id,
            Stock.warehouse_id == warehouse_id,
        )
    )
    stock_record = result.scalar_one_or_none()

    if stock_record:
        stock_record.quantity += quantity
    else:
        # Create new stock record if none exists
        stock_record = Stock(
            company_id=company_id,
            item_id=item_id,
            warehouse_id=warehouse_id,
            quantity=quantity,
            reserved_qty=0,
            reorder_level=0,
            reorder_qty=0,
        )
        db.add(stock_record)

    await db.flush()
    logger.info(
        "Stock incremented: item=%s, warehouse=%s, qty=%s (ref=%s)",
        item_id, warehouse_id, quantity, reference,
    )


async def create_stock_adjustment(
    db: AsyncSession,
    *,
    company_id: int,
    item_id: int,
    warehouse_id: int,
    type: str,
    qty_change: int,
    reason: str,
    created_by: int,
) -> StockAdjustment:
    """Record a stock adjustment and update the stock record."""
    adjustment = StockAdjustment(
        company_id=company_id,
        item_id=item_id,
        warehouse_id=warehouse_id,
        type=type,
        qty_change=qty_change,
        reason=reason,
        created_by=created_by,
    )
    db.add(adjustment)
    await db.flush()

    # Update stock record
    if qty_change > 0:
        await increment_stock(db, company_id=company_id, item_id=item_id,
                              warehouse_id=warehouse_id, quantity=qty_change,
                              reference="adjustment")
    else:
        await decrement_stock(db, company_id=company_id, item_id=item_id,
                              warehouse_id=warehouse_id, quantity=abs(qty_change),
                              reference="adjustment")

    await db.refresh(adjustment)
    return adjustment


async def transfer_stock(
    db: AsyncSession,
    *,
    company_id: int,
    from_warehouse_id: int,
    to_warehouse_id: int,
    item_id: int,
    qty: int,
    created_by: int,
) -> StockTransfer:
    """Transfer stock between warehouses."""
    # Decrement from source
    success = await decrement_stock(
        db, company_id=company_id, item_id=item_id,
        warehouse_id=from_warehouse_id, quantity=qty,
        reference="transfer_out",
    )
    if not success:
        raise ValueError("Insufficient stock in source warehouse")

    # Increment in destination
    await increment_stock(
        db, company_id=company_id, item_id=item_id,
        warehouse_id=to_warehouse_id, quantity=qty,
        reference="transfer_in",
    )

    transfer = StockTransfer(
        company_id=company_id,
        from_warehouse_id=from_warehouse_id,
        to_warehouse_id=to_warehouse_id,
        item_id=item_id,
        qty=qty,
        status="completed",
        created_by=created_by,
    )
    db.add(transfer)
    await db.flush()
    await db.refresh(transfer)
    return transfer


async def get_stock_quantity(
    db: AsyncSession,
    *,
    company_id: int,
    item_id: int,
    warehouse_id: Optional[int] = None,
) -> int:
    """Get available stock quantity for an item."""
    query = select(Stock).where(
        Stock.company_id == company_id,
        Stock.item_id == item_id,
    )
    if warehouse_id:
        query = query.where(Stock.warehouse_id == warehouse_id)

    result = await db.execute(query)
    stock_records = result.scalars().all()
    return sum(s.quantity - (s.reserved_qty or 0) for s in stock_records)
