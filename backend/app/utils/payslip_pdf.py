"""Beautiful payslip PDF generator using ReportLab."""

import io
import base64
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer,
    HRFlowable, Image as RLImage,
)


# ── Page Dimensions ──────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4  # 595.28 x 841.89 pt
MARGIN_LR = 25 * mm   # 70.87 pt each side
MARGIN_TB = 15 * mm   # 42.52 pt top/bottom
USABLE_W = PAGE_W - 2 * MARGIN_LR  # ~453.5 pt


# ── Brand Colors ─────────────────────────────────────────────────────────────
PRIMARY        = colors.HexColor("#4F46E5")
PRIMARY_DARK   = colors.HexColor("#3730A3")
PRIMARY_LIGHT  = colors.HexColor("#EEF2FF")
PRIMARY_MID    = colors.HexColor("#C7D2FE")
SUCCESS        = colors.HexColor("#059669")
SUCCESS_LIGHT  = colors.HexColor("#ECFDF5")
DANGER         = colors.HexColor("#DC2626")
DANGER_LIGHT   = colors.HexColor("#FEF2F2")
MUTED          = colors.HexColor("#6B7280")
LIGHT_MUTED    = colors.HexColor("#9CA3AF")
DARK           = colors.HexColor("#111827")
DARK_70        = colors.HexColor("#374151")
LIGHT_BG       = colors.HexColor("#F9FAFB")
BORDER         = colors.HexColor("#E5E7EB")
DARK_BORDER    = colors.HexColor("#D1D5DB")
WHITE          = colors.white


# ── Paragraph Styles ─────────────────────────────────────────────────────────
def _s(name, **kw):
    defaults = dict(fontName="Helvetica", fontSize=9, textColor=DARK)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)


ST = {
    "company_name":   _s("CN", fontSize=18, fontName="Helvetica-Bold", textColor=WHITE, leading=22),
    "company_addr":   _s("CA", fontSize=8, textColor=colors.HexColor("#C7D2FE"), leading=11),
    "payslip_title":  _s("PT", fontSize=10, textColor=colors.HexColor("#C7D2FE"), alignment=TA_RIGHT),
    "payslip_id":     _s("PI", fontSize=14, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_RIGHT),
    "payslip_status": _s("PS", fontSize=8, fontName="Helvetica-Bold", alignment=TA_RIGHT),
    "section_title":  _s("ST", fontSize=9, fontName="Helvetica-Bold", textColor=PRIMARY, leading=12),
    "field_label":    _s("FL", fontSize=7, textColor=MUTED, leading=10),
    "field_value":    _s("FV", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, leading=12),
    "col_header":     _s("CH", fontSize=7, fontName="Helvetica-Bold", textColor=MUTED, leading=10),
    "item_label":     _s("IL", fontSize=8.5, textColor=DARK_70, leading=11),
    "item_amount":    _s("IA", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, leading=12, alignment=TA_RIGHT),
    "total_label":    _s("TL", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, leading=12),
    "total_earn":     _s("TE", fontSize=10, fontName="Helvetica-Bold", textColor=SUCCESS, leading=13, alignment=TA_RIGHT),
    "total_ded":      _s("TD", fontSize=10, fontName="Helvetica-Bold", textColor=DANGER, leading=13, alignment=TA_RIGHT),
    "net_label":      _s("NL", fontSize=8, textColor=MUTED, alignment=TA_CENTER),
    "net_amount":     _s("NA", fontSize=22, fontName="Helvetica-Bold", textColor=PRIMARY_DARK, alignment=TA_CENTER),
    "net_period":     _s("NP", fontSize=8, textColor=MUTED, alignment=TA_RIGHT),
    "sig_line":       _s("SLN", fontSize=8, textColor=DARK_BORDER, leading=10),
    "sig_label":      _s("SLB", fontSize=7, textColor=MUTED, leading=10),
    "footer":         _s("FT", fontSize=7, textColor=LIGHT_MUTED, alignment=TA_CENTER, leading=10),
}


# ── Helpers ──────────────────────────────────────────────────────────────────

def _fmt(n):
    if n is None:
        return "$0.00"
    return f"${float(n):,.2f}"


def _safe_b64_image(b64_str, width, height):
    """Try to decode a base64 image, return RLImage or None."""
    if not b64_str:
        return None
    try:
        return RLImage(io.BytesIO(base64.b64decode(b64_str)), width=width, height=height)
    except Exception:
        return None


# ── Section: Header ──────────────────────────────────────────────────────────

def _build_header(company_name, company_address, company_logo_b64, payslip_id, status):
    """Deep-indigo header bar with logo, company info, payslip ID, and status badge."""

    # Company logo (or empty placeholder)
    logo_img = _safe_b64_image(company_logo_b64, 44, 44)
    logo_cell = logo_img if logo_img else Paragraph("", ST["company_addr"])

    # Company name + address
    addr_lines = company_address.split("\n") if company_address else []
    addr_text = "<br/>".join(l.strip() for l in addr_lines if l.strip())
    company_info = [Paragraph(f"<b>{company_name}</b>", ST["company_name"])]
    if addr_text:
        company_info.append(Paragraph(addr_text, ST["company_addr"]))

    # Right side: PAYSLIP label, ID, status
    status_color = {
        "paid": "#059669",
        "pending": "#F59E0B",
        "approved": "#3B82F6",
    }.get(status, "#DC2626")

    right_cell = [
        Paragraph("PAYSLIP", ST["payslip_title"]),
        Paragraph(f"<b>{payslip_id}</b>", ST["payslip_id"]),
        Paragraph(
            f'<font color="{status_color}"><b>● {status.upper()}</b></font>',
            ST["payslip_status"],
        ),
    ]

    # Layout: left side = logo (54pt) + gap + company info, right side = 160pt
    right_w = 160
    left_w = USABLE_W - right_w

    left_cell = Table(
        [[logo_cell, company_info]],
        colWidths=[54, left_w - 54],
    )
    left_cell.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
        ("TOPPADDING",    (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    header = Table(
        [[left_cell, right_cell]],
        colWidths=[left_w, right_w],
    )
    header.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING",   (0, 0), (0, 0), 16),
        ("RIGHTPADDING",  (0, 0), (0, 0), 0),
        ("LEFTPADDING",   (1, 0), (1, 0), 0),
        ("RIGHTPADDING",  (1, 0), (1, 0), 16),
        ("TOPPADDING",    (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("BACKGROUND",    (0, 0), (-1, -1), PRIMARY),
    ]))

    return [header, Spacer(1, 16)]


# ── Section: Employee Info ───────────────────────────────────────────────────

def _build_employee_section(employee_name, employee_code, department,
                             designation, period, paid_date):
    """3×2 grid of employee fields inside a card."""

    lbl = ST["field_label"]
    val = ST["field_value"]

    fields = [
        ("Employee", employee_name or "N/A"),
        ("Employee ID", employee_code or "N/A"),
        ("Department", department or "N/A"),
        ("Designation", designation or "N/A"),
        ("Pay Period", period or "N/A"),
        ("Paid Date", paid_date or "N/A"),
    ]

    # Each "column" is actually a label+value pair → 2 sub-cells.
    # We want 3 columns per row → 6 cells per row.
    COLS = 6
    col_w = USABLE_W / 3  # each label-value pair gets 1/3 of width

    # But within each pair, label gets 40% and value gets 60%
    pair_widths = [col_w * 0.4, col_w * 0.6]
    row_widths = pair_widths * 3  # repeat for 3 columns = [w_l, w_v, w_l, w_v, w_l, w_v]

    rows = []
    for i in range(0, len(fields), 3):
        row = []
        chunk = fields[i:i+3]
        for label, value in chunk:
            row.append(Paragraph(label.upper(), lbl))
            row.append(Paragraph(str(value), val))
        # Pad to COLS cells
        while len(row) < COLS:
            row.append("")
        rows.append(row)

    t = Table(rows, colWidths=row_widths)
    t.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("BACKGROUND",    (0, 0), (-1, -1), LIGHT_BG),
        ("BOX",           (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW",     (0, 0), (-1, 0), 0.25, BORDER),
    ]))

    return [t, Spacer(1, 16)]


# ── Section: Earnings & Deductions ───────────────────────────────────────────

def _build_earnings_deductions(earnings, deductions):
    """Side-by-side earnings and deductions tables."""

    lbl = ST["item_label"]
    amt = ST["item_amount"]
    tot_lbl = ST["total_label"]
    tot_ear = ST["total_earn"]
    tot_ded = ST["total_ded"]
    col_hdr = ST["col_header"]

    earnings_total = sum(e["amount"] for e in earnings)
    deductions_total = sum(d["amount"] for d in deductions)

    # Each side gets half the usable width, minus a small gap
    SIDE_W = (USABLE_W - 8) / 2  # 4pt gap between the two tables
    DESC_W = SIDE_W * 0.65
    AMT_W  = SIDE_W * 0.35

    # ── Earnings ──
    earn_rows = [[Paragraph("DESCRIPTION", col_hdr), Paragraph("AMOUNT", col_hdr)]]
    for e in earnings:
        earn_rows.append([
            Paragraph(e["name"], lbl),
            Paragraph(_fmt(e["amount"]), amt),
        ])
    earn_rows.append([
        Paragraph("<b>Total Earnings</b>", tot_lbl),
        Paragraph(f"<b>{_fmt(earnings_total)}</b>", tot_ear),
    ])

    earn_style = [
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        # Header row
        ("BACKGROUND",    (0, 0), (-1, 0), SUCCESS_LIGHT),
        ("LINEBELOW",     (0, 0), (-1, 0), 1, SUCCESS),
        # Total row
        ("BACKGROUND",    (0, -1), (-1, -1), SUCCESS_LIGHT),
        ("LINEBELOW",     (0, -1), (-1, -1), 1, SUCCESS),
    ]
    # Alternating rows
    for i in range(1, len(earn_rows) - 1):
        if i % 2 == 0:
            earn_style.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#F0FDF4")))

    earn_table = Table(earn_rows, colWidths=[DESC_W, AMT_W])
    earn_table.setStyle(TableStyle(earn_style))

    # ── Deductions ──
    ded_rows = [[Paragraph("DESCRIPTION", col_hdr), Paragraph("AMOUNT", col_hdr)]]
    for d in deductions:
        ded_rows.append([
            Paragraph(d["name"], lbl),
            Paragraph(f"-{_fmt(d['amount'])}", amt),
        ])
    ded_rows.append([
        Paragraph("<b>Total Deductions</b>", tot_lbl),
        Paragraph(f"<b>-{_fmt(deductions_total)}</b>", tot_ded),
    ])

    ded_style = [
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("BACKGROUND",    (0, 0), (-1, 0), DANGER_LIGHT),
        ("LINEBELOW",     (0, 0), (-1, 0), 1, DANGER),
        ("BACKGROUND",    (0, -1), (-1, -1), DANGER_LIGHT),
        ("LINEBELOW",     (0, -1), (-1, -1), 1, DANGER),
    ]
    for i in range(1, len(ded_rows) - 1):
        if i % 2 == 0:
            ded_style.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#FEF2F2")))

    ded_table = Table(ded_rows, colWidths=[DESC_W, AMT_W])
    ded_table.setStyle(TableStyle(ded_style))

    # ── Side-by-side wrapper ──
    wrapper = Table(
        [[earn_table, ded_table]],
        colWidths=[SIDE_W, SIDE_W],
    )
    wrapper.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
        ("TOPPADDING",    (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    return [wrapper, Spacer(1, 16)]


# ── Section: Net Pay ─────────────────────────────────────────────────────────

def _build_net_pay(net_pay, period, payment_method="Bank Transfer"):
    """Highlighted net pay summary card."""

    label_w = USABLE_W * 0.15
    amount_w = USABLE_W * 0.50
    info_w = USABLE_W - label_w - amount_w

    content = [[
        Paragraph("NET PAY", ST["net_label"]),
        Paragraph(_fmt(net_pay), ST["net_amount"]),
        Paragraph(f"<b>{payment_method}</b><br/>Period: {period}", ST["net_period"]),
    ]]

    t = Table(content, colWidths=[label_w, amount_w, info_w])
    t.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",    (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("LEFTPADDING",   (0, 0), (-1, -1), 16),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 16),
        ("BACKGROUND",    (0, 0), (-1, -1), PRIMARY_LIGHT),
        ("BOX",           (0, 0), (-1, -1), 1.5, PRIMARY),
        ("LINEAFTER",     (0, 0), (0, 0), 0.5, PRIMARY_MID),
    ]))

    return [t, Spacer(1, 20)]


# ── Section: Signatures ──────────────────────────────────────────────────────

def _build_signature_section(employee_signature_b64, company_name):
    """Dual signature lines: employee + authorized signatory."""

    sig_lbl = ST["sig_label"]
    sig_line_style = ST["sig_line"]

    # Employee signature (image or underscore line)
    emp_sig = _safe_b64_image(employee_signature_b64, 120, 35)
    if not emp_sig:
        emp_sig = Paragraph("_" * 38, sig_line_style)

    # HR / Authorized signature (underscore line)
    auth_sig = Paragraph("_" * 38, sig_line_style)

    LEFT_W = 200
    GAP_W = USABLE_W - 2 * LEFT_W
    RIGHT_W = LEFT_W

    sig_data = [
        [emp_sig, Paragraph("", sig_lbl), auth_sig],
        [Paragraph("Employee Signature", sig_lbl), Paragraph("", sig_lbl),
         Paragraph(f"Authorized by — {company_name}", sig_lbl)],
    ]

    sig_table = Table(sig_data, colWidths=[LEFT_W, GAP_W, RIGHT_W])
    sig_table.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
    ]))

    return [sig_table, Spacer(1, 16)]


# ── Section: Footer ──────────────────────────────────────────────────────────

def _build_footer(company_name):
    """Subtle footer with disclaimer."""
    return [
        HRFlowable(width="100%", thickness=0.5, color=BORDER),
        Spacer(1, 6),
        Paragraph(
            f"This is a system-generated payslip and does not require a signature. "
            f"For queries, contact HR at your organization. | {company_name}",
            ST["footer"],
        ),
    ]


# ── Main Generator ───────────────────────────────────────────────────────────

def generate_payslip_pdf(
    *,
    company_name: str,
    company_address: str,
    company_logo_b64: str | None,
    employee_name: str,
    employee_code: str,
    department: str,
    designation: str,
    payslip_id: str,
    status: str,
    period: str,
    paid_date: str,
    earnings: list[dict],
    deductions: list[dict],
    net_pay: float,
    employee_signature_b64: str | None = None,
) -> bytes:
    """Generate a beautiful payslip PDF and return the bytes."""
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=MARGIN_LR,
        rightMargin=MARGIN_LR,
        topMargin=MARGIN_TB,
        bottomMargin=MARGIN_TB,
    )

    elements = []

    # Header
    elements.extend(
        _build_header(company_name, company_address, company_logo_b64, payslip_id, status)
    )

    # Employee info card
    elements.extend(
        _build_employee_section(employee_name, employee_code, department, designation, period, paid_date)
    )

    # Earnings & Deductions side by side
    elements.extend(_build_earnings_deductions(earnings, deductions))

    # Net pay highlight
    elements.extend(_build_net_pay(net_pay, period))

    # Signature lines
    elements.extend(_build_signature_section(employee_signature_b64, company_name))

    # Footer
    elements.extend(_build_footer(company_name))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
