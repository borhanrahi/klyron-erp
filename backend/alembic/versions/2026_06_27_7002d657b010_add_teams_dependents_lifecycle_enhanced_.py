"""Add teams, dependents, lifecycle, enhanced designation and employee fields

Revision ID: 7002d657b010
Revises: [previous_revision_id]
Create Date: 2026-06-27 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "7002d657b010"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create teams table
    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("company_id", sa.Integer(), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("lead_id", sa.Integer(), sa.ForeignKey("employees.id"), nullable=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id"), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_teams_id"), "teams", ["id"])

    # Create employee_teams association table
    op.create_table(
        "employee_teams",
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id"), nullable=False),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("role", sa.String(length=50), server_default=sa.text("'member'"), nullable=True),
        sa.Column("joined_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.PrimaryKeyConstraint("employee_id", "team_id"),
    )

    # Create employee_dependents table
    op.create_table(
        "employee_dependents",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("company_id", sa.Integer(), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("relationship_type", sa.String(length=50), nullable=False),
        sa.Column("date_of_birth", sa.DateTime(timezone=True), nullable=True),
        sa.Column("gender", sa.String(length=20), nullable=True),
        sa.Column("national_id", sa.String(length=100), nullable=True),
        sa.Column("is_beneficiary", sa.Boolean(), server_default=sa.text("false"), nullable=True),
        sa.Column("is_emergency_contact", sa.Boolean(), server_default=sa.text("false"), nullable=True),
        sa.Column("phone", sa.String(length=50), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("occupation", sa.String(length=100), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_employee_dependents_id"), "employee_dependents", ["id"])

    # Create employee_lifecycle table
    op.create_table(
        "employee_lifecycle",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("company_id", sa.Integer(), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id"), nullable=False),
        sa.Column("from_status", sa.String(length=50), nullable=True),
        sa.Column("to_status", sa.String(length=50), nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("effective_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("changed_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_employee_lifecycle_id"), "employee_lifecycle", ["id"])

    # Add new columns to employees table
    op.add_column("employees", sa.Column("secondary_supervisor_id", sa.Integer(), sa.ForeignKey("employees.id"), nullable=True))
    op.add_column("employees", sa.Column("skip_level_manager_id", sa.Integer(), sa.ForeignKey("employees.id"), nullable=True))

    # Add new columns to designations table
    op.add_column("designations", sa.Column("grade_level", sa.String(length=50), nullable=True))
    op.add_column("designations", sa.Column("min_salary", sa.Numeric(15, 2), nullable=True))
    op.add_column("designations", sa.Column("max_salary", sa.Numeric(15, 2), nullable=True))
    op.add_column("designations", sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=True))


def downgrade() -> None:
    # Drop new columns from designations
    op.drop_column("designations", "is_active")
    op.drop_column("designations", "max_salary")
    op.drop_column("designations", "min_salary")
    op.drop_column("designations", "grade_level")

    # Drop new columns from employees
    op.drop_column("employees", "skip_level_manager_id")
    op.drop_column("employees", "secondary_supervisor_id")

    # Drop new tables
    op.drop_table("employee_lifecycle")
    op.drop_table("employee_dependents")
    op.drop_table("employee_teams")
    op.drop_table("teams")
