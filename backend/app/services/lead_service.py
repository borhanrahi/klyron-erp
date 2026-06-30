"""Lead Management Service — assignment engine, activity logging, scoring."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from sqlalchemy.orm import selectinload
from datetime import datetime
from typing import Optional

from app.models.sales import (
    Lead, LeadActivity, LeadTask,
    LeadAssignmentRule, LeadAssignmentDistribution, LeadAssignmentLog,
)
from app.models.hr import Employee, employee_teams_table
from app.models.auth import User
from app.services.event_bus import event_bus


# ── Activity Logging ─────────────────────────────────────────────────────────

async def log_activity(
    db: AsyncSession,
    *,
    lead_id: int,
    company_id: int,
    activity_type: str,
    description: str,
    created_by: Optional[int] = None,
    old_value: Optional[str] = None,
    new_value: Optional[str] = None,
) -> LeadActivity:
    """Log an activity on a lead (timeline entry)."""
    activity = LeadActivity(
        lead_id=lead_id,
        company_id=company_id,
        activity_type=activity_type,
        description=description,
        created_by=created_by,
        old_value=old_value,
        new_value=new_value,
    )
    db.add(activity)

    # Update last_activity_at on the lead
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if lead:
        lead.last_activity_at = datetime.utcnow()

    await db.flush()
    await db.refresh(activity)

    await event_bus.emit("lead.activity.created",
                         lead_id=lead_id,
                         company_id=company_id,
                         activity_type=activity_type)

    return activity


# ── Criteria Matching ──────────────────────────────────────────────────────

def lead_matches_criteria(lead, criteria: Optional[dict]) -> bool:
    """Check if a lead matches the criteria defined on an assignment rule.

    Criteria format:
    {
        "sources": ["website", "referral", "linkedin"],        # Lead source must be in this list
        "industries": ["Technology", "Finance"],               # Lead industry must be in this list
        "min_lead_value": 1000,                                  # Minimum estimated deal value
        "max_lead_value": 50000,                                 # Maximum estimated deal value
        "has_email": True,                                       # Must have an email
        "has_phone": True,                                       # Must have a phone
        "min_score": 20,                                         # Minimum lead score
    }
    Empty or None criteria means the lead matches (catch-all).
    """
    if not criteria:
        return True

    # Source matching
    sources = criteria.get("sources")
    if sources and lead.source:
        if lead.source.lower() not in [s.lower() for s in sources]:
            return False
    elif sources and not lead.source:
        return False  # sources specified but lead has no source

    # Industry matching
    industries = criteria.get("industries")
    if industries and lead.industry:
        if lead.industry.lower() not in [ind.lower() for ind in industries]:
            return False
    elif industries and not lead.industry:
        return False

    # Lead value range
    min_val = criteria.get("min_lead_value")
    max_val = criteria.get("max_lead_value")
    if min_val is not None and (lead.lead_value is None or float(lead.lead_value) < min_val):
        return False
    if max_val is not None and (lead.lead_value is not None and float(lead.lead_value) > max_val):
        return False

    # Contact completeness
    has_email = criteria.get("has_email")
    if has_email is True and not lead.email:
        return False
    has_phone = criteria.get("has_phone")
    if has_phone is True and not lead.phone:
        return False

    # Minimum score
    min_score = criteria.get("min_score")
    if min_score is not None and (lead.score is None or lead.score < min_score):
        return False

    return True


async def get_team_member_user_ids(
    db: AsyncSession,
    *,
    company_id: int,
    team_id: int,
) -> list[int]:
    """Get all user_ids for employees belonging to a specific team."""
    result = await db.execute(
        select(Employee.user_id)
        .join(employee_teams_table, Employee.id == employee_teams_table.c.employee_id)
        .where(
            employee_teams_table.c.team_id == team_id,
            Employee.company_id == company_id,
            Employee.deleted_at.is_(None),
            Employee.status == "active",
            Employee.user_id.isnot(None),
        )
    )
    return [row[0] for row in result.all() if row[0] is not None]


# ── Assignment Engine ────────────────────────────────────────────────────────

async def assign_lead_auto(
    db: AsyncSession,
    *,
    company_id: int,
    lead_id: int,
    assigned_by: int,
    rule_id: Optional[int] = None,
) -> Lead:
    """Auto-assign a lead using the active assignment rule (round-robin or ratio).

    The rule is matched against the lead's attributes (source, industry, value, etc.)
    and only team members belonging to the rule's team (if set) are eligible.
    """
    # Find the active rule
    if rule_id:
        result = await db.execute(
            select(LeadAssignmentRule)
            .options(selectinload(LeadAssignmentRule.distributions))
            .where(LeadAssignmentRule.id == rule_id, LeadAssignmentRule.company_id == company_id)
        )
    else:
        result = await db.execute(
            select(LeadAssignmentRule)
            .options(selectinload(LeadAssignmentRule.distributions))
            .where(
                LeadAssignmentRule.company_id == company_id,
                LeadAssignmentRule.is_active == True,
                LeadAssignmentRule.rule_type.in_(["round_robin", "ratio"]),
            )
            .order_by(LeadAssignmentRule.created_at.desc())
        )
    rules = result.scalars().unique().all()

    if not rules:
        raise ValueError("No active assignment rule found")

    # Get the lead
    lead_result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.company_id == company_id))
    lead = lead_result.scalar_one_or_none()
    if not lead:
        raise ValueError("Lead not found")

    if lead.assigned_to:
        raise ValueError("Lead is already assigned")

    # Find the first rule whose criteria the lead matches
    matched_rule = None
    for r in rules:
        if lead_matches_criteria(lead, r.criteria):
            matched_rule = r
            break

    if not matched_rule or not matched_rule.distributions:
        raise ValueError("No matching rule found for this lead — check criteria configuration")

    rule = matched_rule
    members = rule.distributions

    # If rule is restricted to a team, verify each distribution member is in that team
    eligible_user_ids = [m.user_id for m in members]
    if rule.team_id:
        team_user_ids = await get_team_member_user_ids(db, company_id=company_id, team_id=rule.team_id)
        eligible_user_ids = [uid for uid in eligible_user_ids if uid in team_user_ids]
        if not eligible_user_ids:
            raise ValueError(f"No team members found in the assigned team for rule '{rule.name}'")

    # Determine who to assign based on rule type
    if rule.rule_type == "round_robin":
        # Find the member with the fewest current assignments
        assignment_counts = {}
        for uid in eligible_user_ids:
            count_result = await db.execute(
                select(sa_func.count()).select_from(Lead).where(
                    Lead.assigned_to == uid,
                    Lead.company_id == company_id,
                    Lead.status.in_(["new", "contacted", "qualified", "proposal"]),
                    Lead.deleted_at.is_(None),
                )
            )
            assignment_counts[uid] = count_result.scalar() or 0

        # Pick the user with the least assignments (load-balanced round-robin)
        target_user_id = min(assignment_counts, key=assignment_counts.get)

    elif rule.rule_type == "ratio":
        # Distribute based on weight ratios
        user_weights = {m.user_id: m.weight for m in members if m.user_id in eligible_user_ids}
        if not user_weights:
            raise ValueError("No eligible team members with weights configured")

        total_weight = sum(user_weights.values())
        if total_weight == 0:
            raise ValueError("Distribution weights sum to zero")

        # Count current assignments per member to find who is below their ratio
        assignment_counts = {}
        for uid in user_weights:
            count_result = await db.execute(
                select(sa_func.count()).select_from(Lead).where(
                    Lead.assigned_to == uid,
                    Lead.company_id == company_id,
                    Lead.status.in_(["new", "contacted", "qualified", "proposal"]),
                    Lead.deleted_at.is_(None),
                )
            )
            assignment_counts[uid] = count_result.scalar() or 0

        # Calculate who is most "under-assigned" relative to their weight
        target_user_id = min(
            user_weights,
            key=lambda uid: (
                assignment_counts[uid] / (user_weights[uid] / total_weight)
                if user_weights[uid] > 0
                else float("inf")
            ),
        )
    else:
        raise ValueError(f"Unsupported rule type: {rule.rule_type}")

    # Assign the lead
    lead.assigned_to = target_user_id
    await db.flush()

    # Log the assignment
    log = LeadAssignmentLog(
        lead_id=lead_id,
        company_id=company_id,
        rule_id=rule.id,
        assigned_by=assigned_by,
        assigned_to=target_user_id,
        assignment_type=rule.rule_type,
    )
    db.add(log)

    # Log activity
    await log_activity(
        db, lead_id=lead_id, company_id=company_id,
        activity_type="assignment",
        description=f"Lead auto-assigned via {rule.rule_type} rule: '{rule.name}'",
        created_by=assigned_by,
        new_value=str(target_user_id),
    )

    await db.flush()
    await db.refresh(lead)
    return lead


async def assign_lead_manual(
    db: AsyncSession,
    *,
    company_id: int,
    lead_id: int,
    assigned_to: int,
    assigned_by: int,
) -> Lead:
    """Manually assign a lead to a specific user."""
    result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.company_id == company_id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise ValueError("Lead not found")

    old_assigned = lead.assigned_to
    lead.assigned_to = assigned_to
    await db.flush()

    # Log the assignment
    log = LeadAssignmentLog(
        lead_id=lead_id,
        company_id=company_id,
        assigned_by=assigned_by,
        assigned_to=assigned_to,
        assignment_type="manual",
    )
    db.add(log)

    # Log activity
    old_name = str(old_assigned) if old_assigned else "unassigned"
    await log_activity(
        db, lead_id=lead_id, company_id=company_id,
        activity_type="assignment",
        description=f"Lead assigned manually",
        created_by=assigned_by,
        old_value=old_name,
        new_value=str(assigned_to),
    )

    await db.flush()
    await db.refresh(lead)
    return lead


async def reassign_batch(
    db: AsyncSession,
    *,
    company_id: int,
    lead_ids: list[int],
    assigned_to: int,
    assigned_by: int,
) -> int:
    """Reassign multiple leads at once to a specific user. Returns count."""
    count = 0
    for lid in lead_ids:
        try:
            await assign_lead_manual(
                db, company_id=company_id, lead_id=lid,
                assigned_to=assigned_to, assigned_by=assigned_by,
            )
            count += 1
        except ValueError:
            continue
    return count


# ── Task Management ──────────────────────────────────────────────────────────

async def create_lead_task(
    db: AsyncSession,
    *,
    lead_id: int,
    company_id: int,
    title: str,
    assigned_to: int,
    created_by: int,
    description: Optional[str] = None,
    due_date: Optional[datetime] = None,
    priority: str = "medium",
) -> LeadTask:
    """Create a task for a lead and log the activity."""
    task = LeadTask(
        lead_id=lead_id,
        company_id=company_id,
        title=title,
        description=description,
        assigned_to=assigned_to,
        due_date=due_date,
        priority=priority,
        created_by=created_by,
    )
    db.add(task)
    await db.flush()
    await db.refresh(task)

    await log_activity(
        db, lead_id=lead_id, company_id=company_id,
        activity_type="task_created",
        description=f"Task created: {title}",
        created_by=created_by,
    )

    await event_bus.emit("lead.task.created",
                         lead_id=lead_id,
                         company_id=company_id,
                         task_id=task.id,
                         assigned_to=assigned_to)

    return task


async def complete_lead_task(
    db: AsyncSession,
    *,
    task_id: int,
    company_id: int,
    completed_by: int,
) -> LeadTask:
    """Mark a task as completed and log the activity."""
    result = await db.execute(
        select(LeadTask).where(LeadTask.id == task_id, LeadTask.company_id == company_id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise ValueError("Task not found")

    task.status = "completed"
    task.completed_at = datetime.utcnow()
    await db.flush()

    await log_activity(
        db, lead_id=task.lead_id, company_id=company_id,
        activity_type="task_completed",
        description=f"Task completed: {task.title}",
        created_by=completed_by,
    )

    await db.refresh(task)
    return task


# ── Lead Scoring ─────────────────────────────────────────────────────────────

def calculate_lead_score(
    *,
    source: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    company_name: Optional[str] = None,
    lead_value: float = 0,
    tags: Optional[list[str]] = None,
) -> int:
    """Calculate a lead score based on lead quality signals.
    Returns score 0-100.

    Scoring criteria:
    - Has email: +15
    - Has phone: +10
    - Has company name: +20 (B2B signal)
    - Source quality:
      - referral: +15
      - website/organic: +10
      - social: +5
      - cold_call: +0
    - Lead value > 0: +5 per $1000 (max +20)
    - Tags indicate high intent (e.g., "hot", "vip"): +15
    """
    score = 0

    # Contact completeness
    if email:
        score += 15
    if phone:
        score += 10
    if company_name:
        score += 20  # B2B signal — real business

    # Source quality
    source_scores = {
        "referral": 15,
        "website": 10,
        "organic": 10,
        "social": 5,
        "linkedin": 10,
        "email_campaign": 8,
        "event": 12,
        "cold_call": 0,
        "other": 3,
    }
    if source:
        score += source_scores.get(source.lower(), 3)

    # Lead value (estimated deal size)
    if lead_value > 0:
        value_points = min(int(lead_value / 1000) * 5, 20)
        score += value_points

    # Tags indicating high intent
    if tags:
        high_intent_tags = {"hot", "vip", "priority", "urgent", "decision_maker"}
        if any(t.lower() in high_intent_tags for t in tags):
            score += 15

    return min(score, 100)


# ── Dashboard / Analytics ────────────────────────────────────────────────────

async def get_lead_team_stats(
    db: AsyncSession,
    *,
    company_id: int,
) -> dict:
    """Get lead statistics grouped by team member for manager dashboard."""
    # Total leads count
    total = await db.execute(
        select(sa_func.count()).select_from(Lead).where(
            Lead.company_id == company_id,
            Lead.deleted_at.is_(None),
        )
    )
    total_leads = total.scalar() or 0

    # Leads by status
    status_counts = {}
    for status_val in ["new", "contacted", "qualified", "proposal", "won", "lost"]:
        cnt = await db.execute(
            select(sa_func.count()).select_from(Lead).where(
                Lead.company_id == company_id,
                Lead.status == status_val,
                Lead.deleted_at.is_(None),
            )
        )
        status_counts[status_val] = cnt.scalar() or 0

    # Get all assigned users and their counts
    assigned_users = await db.execute(
        select(Lead.assigned_to, sa_func.count().label("cnt"))
        .where(
            Lead.company_id == company_id,
            Lead.assigned_to.isnot(None),
            Lead.deleted_at.is_(None),
        )
        .group_by(Lead.assigned_to)
    )
    user_stats_rows = assigned_users.all()

    # Tasks stats
    total_tasks = await db.execute(
        select(sa_func.count()).select_from(LeadTask).where(
            LeadTask.company_id == company_id,
        )
    )
    completed_tasks = await db.execute(
        select(sa_func.count()).select_from(LeadTask).where(
            LeadTask.company_id == company_id,
            LeadTask.status == "completed",
        )
    )

    return {
        "total_leads": total_leads,
        "by_status": status_counts,
        "conversion_rate": round(
            (status_counts.get("won", 0) / max(total_leads, 1)) * 100, 1
        ),
        "unassigned": status_counts.get("new", 0),
        "total_tasks": total_tasks.scalar() or 0,
        "completed_tasks": completed_tasks.scalar() or 0,
    }


async def get_team_performance(
    db: AsyncSession,
    *,
    company_id: int,
) -> list[dict]:
    """Get per-user lead performance stats."""
    users_with_leads = await db.execute(
        select(Lead.assigned_to.distinct())
        .where(
            Lead.company_id == company_id,
            Lead.assigned_to.isnot(None),
            Lead.deleted_at.is_(None),
        )
    )
    user_ids = [row[0] for row in users_with_leads.all()]

    result = []
    for uid in user_ids:
        # Leads assigned to this user
        total = await db.execute(
            select(sa_func.count()).select_from(Lead).where(
                Lead.assigned_to == uid,
                Lead.company_id == company_id,
                Lead.deleted_at.is_(None),
            )
        )
        total_assigned = total.scalar() or 0

        won = await db.execute(
            select(sa_func.count()).select_from(Lead).where(
                Lead.assigned_to == uid,
                Lead.company_id == company_id,
                Lead.status == "won",
                Lead.deleted_at.is_(None),
            )
        )
        won_count = won.scalar() or 0

        # Tasks assigned to this user
        user_tasks = await db.execute(
            select(sa_func.count()).select_from(LeadTask).where(
                LeadTask.assigned_to == uid,
                LeadTask.company_id == company_id,
                LeadTask.status == "completed",
            )
        )
        completed_tasks_count = user_tasks.scalar() or 0

        result.append({
            "user_id": uid,
            "total_assigned": total_assigned,
            "won": won_count,
            "conversion_rate": round((won_count / max(total_assigned, 1)) * 100, 1),
            "completed_tasks": completed_tasks_count,
        })

    return result
