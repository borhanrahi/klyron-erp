"""Add signature_url to employees table

Revision ID: a1b2c3d4e5f6
Revises: 
Create Date: 2026-06-24
"""
from alembic import op
import sqlalchemy as sa

revision = "a1b2c3d4e5f6"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("employees", sa.Column("signature_url", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("employees", "signature_url")
