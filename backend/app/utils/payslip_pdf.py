"""Professional payslip PDF generator."""

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

PAGE_W, PAGE_H = A4
MARGIN_LR = 20 * mm
MARGIN_TB = 14 * mm
USABLE_W = PAGE_W - 2 * MARGIN_LR

NAVY        = colors.HexColor("#1E3A5F")
NAVY_DARK   = colors.HexColor("#15294A")
NAVY_LIGHT  = colors.HexColor("#EBF0F6")
MUTED       = colors.HexColor("#6B7280")
DARK        = colors.HexColor("#111827")
DARK_70     = colors.HexColor("#374151")
LIGHT_BG    = colors.HexColor("#F8F9FB")
BORDER      = colors.HexColor("#DEE2E6")
WHITE       = colors.white
GREEN       = colors.HexColor("#059669")
RED         = colors.HexColor("#DC2626")

def _s(name, **kw):
    defaults = dict(fontName="Helvetica", fontSize=9, textColor=DARK, leading=12)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

ST = {
    "h_name":   _s("HN", fontSize=15, fontName="Helvetica-Bold", textColor=WHITE, leading=18),
    "h_addr":   _s("HA", fontSize=7, textColor=colors.HexColor("#B0C4DE"), leading=9),
    "h_label":  _s("HL", fontSize=7, textColor=colors.HexColor("#B0C4DE"), alignment=TA_RIGHT, leading=9),
    "h_id":     _s("HI", fontSize=14, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_RIGHT, leading=17),
    "h_status": _s("HS", fontSize=7.5, fontName="Helvetica-Bold", alignment=TA_RIGHT, leading=9),
    "f_lbl":    _s("FL", fontSize=6.5, textColor=MUTED, leading=8),
    "f_val":    _s("FV", fontSize=8.5, fontName="Helvetica-Bold", textColor=DARK, leading=11),
    "c_hdr":    _s("CH", fontSize=7, fontName="Helvetica-Bold", textColor=MUTED, leading=9),
    "i_name":   _s("IN", fontSize=8.5, textColor=DARK_70, leading=11),
    "i_amt":    _s("IA", fontSize=8.5, fontName="Helvetica-Bold", textColor=DARK, leading=11, alignment=TA_RIGHT),
    "total_l":  _s("TL", fontSize=9, fontName="Helvetica-Bold", textColor=DARK_70, leading=12),
    "total_v":  _s("TV", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, leading=12, alignment=TA_RIGHT),
    "summary_l":_s("SL", fontSize=7, textColor=MUTED, alignment=TA_CENTER, leading=9),
    "summary_v":_s("SV", fontSize=16, fontName="Helvetica-Bold", textColor=DARK, alignment=TA_CENTER, leading=19),
    "summary_n":_s("SN", fontSize=20, fontName="Helvetica-Bold", textColor=NAVY, alignment=TA_CENTER, leading=24),
    "sig_lbl":  _s("SL", fontSize=7, textColor=MUTED, leading=9),
    "footer":   _s("FT", fontSize=6.5, textColor=colors.HexColor("#9CA3AF"), alignment=TA_CENTER, leading=9),
}

def _fmt(n):
    if n is None:
        return "$0.00"
    return f"${float(n):,.2f}"

def _safe_b64_image(b64_str, width, height):
    if not b64_str:
        return None
    try:
        return RLImage(io.BytesIO(base64.b64decode(b64_str)), width=width, height=height)
    except Exception:
        return None

def _style_table(ops):
    def apply(t):
        t.setStyle(TableStyle(ops))
        return t
    return apply

def _build_header(company_name, company_address, company_logo_b64, payslip_id, status):
    logo_img = _safe_b64_image(company_logo_b64, 38, 38)
    logo_cell = logo_img if logo_img else Paragraph("", ST["h_addr"])

    addr_lines = company_address.split("\n") if company_address else []
    addr_text = "<br/>".join(l.strip() for l in addr_lines if l.strip())
    info = [Paragraph(company_name, ST["h_name"])]
    if addr_text:
        info.append(Paragraph(addr_text, ST["h_addr"]))

    status_color = {"paid": "#059669", "pending": "#F59E0B", "approved": "#3B82F6"}.get(status, "#DC2626")

    left = Table([[logo_cell, info]], colWidths=[44, USABLE_W - 44 - 145])
    _style_table([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ])(left)

    right = Table([
        [Paragraph("PAYSLIP", ST["h_label"])],
        [Paragraph(payslip_id, ST["h_id"])],
        [Paragraph(f'<font color="{status_color}"><b>\u25cf {status.upper()}</b></font>', ST["h_status"])],
    ], colWidths=[145])
    _style_table([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ])(right)

    header = Table([[left, right]], colWidths=[USABLE_W - 145, 145])
    _style_table([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
    ])(header)
    return [header, Spacer(1, 14)]

def _build_employee_section(employee_name, employee_code, department,
                             designation, period, paid_date):
    fields = [
        ("Employee", employee_name or "N/A"),
        ("Employee ID", employee_code or "N/A"),
        ("Department", department or "N/A"),
        ("Designation", designation or "N/A"),
        ("Pay Period", period or "N/A"),
        ("Paid Date", paid_date or "N/A"),
    ]
    col_w = USABLE_W / 3
    pw = [col_w * 0.33, col_w * 0.67]
    row_widths = pw * 3
    rows = []
    for i in range(0, len(fields), 3):
        row = []
        for label, value in fields[i:i+3]:
            row.append(Paragraph(label.upper(), ST["f_lbl"]))
            row.append(Paragraph(str(value), ST["f_val"]))
        rows.append(row)

    t = Table(rows, colWidths=row_widths)
    _style_table([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 0.25, BORDER),
        ("LINEBELOW", (0, 1), (-1, 1), 0.25, BORDER),
    ])(t)
    return [t, Spacer(1, 14)]

def _build_earnings_deductions(earnings, deductions):
    earnings_total = sum(e["amount"] for e in earnings)
    deductions_total = sum(d["amount"] for d in deductions)

    SIDE_W = (USABLE_W - 8) / 2
    DESC_W = SIDE_W * 0.6
    AMT_W = SIDE_W * 0.4

    def make_table(rows):
        alt = colors.HexColor("#F8F9FB")
        style = [
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 4.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("BACKGROUND", (0, 0), (-1, 0), NAVY_LIGHT),
            ("LINEBELOW", (0, 0), (-1, 0), 0.75, NAVY),
            ("LINEBELOW", (0, -1), (-1, -1), 0.75, NAVY),
        ]
        for i in range(1, len(rows) - 1):
            if i % 2 == 0:
                style.append(("BACKGROUND", (0, i), (-1, i), alt))
        t = Table(rows, colWidths=[DESC_W, AMT_W])
        _style_table(style)(t)
        return t

    earn_rows = [[Paragraph("EARNINGS", ST["c_hdr"]), Paragraph("AMOUNT", ST["c_hdr"])]]
    for e in earnings:
        earn_rows.append([Paragraph(e["name"], ST["i_name"]), Paragraph(_fmt(e["amount"]), ST["i_amt"])])
    earn_rows.append([Paragraph("<b>Total Earnings</b>", ST["total_l"]), Paragraph(f"<b>{_fmt(earnings_total)}</b>", ST["total_v"])])

    ded_rows = [[Paragraph("DEDUCTIONS", ST["c_hdr"]), Paragraph("AMOUNT", ST["c_hdr"])]]
    for d in deductions:
        ded_rows.append([Paragraph(d["name"], ST["i_name"]), Paragraph(f"-{_fmt(d['amount'])}", ST["i_amt"])])
    ded_rows.append([Paragraph("<b>Total Deductions</b>", ST["total_l"]), Paragraph(f"<b>-{_fmt(deductions_total)}</b>", ST["total_v"])])

    earn_table = make_table(earn_rows)
    ded_table = make_table(ded_rows)

    wrapper = Table([[earn_table, ded_table]], colWidths=[SIDE_W, SIDE_W])
    _style_table([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ])(wrapper)
    return [wrapper, Spacer(1, 14)]

def _build_summary(earnings_total, deductions_total, net_pay, period):
    gross = earnings_total

    col_w = USABLE_W / 3
    rows = [[
        Paragraph("GROSS PAY", ST["summary_l"]),
        Paragraph("TOTAL DEDUCTIONS", ST["summary_l"]),
        Paragraph("NET PAY", ST["summary_l"]),
    ], [
        Paragraph(_fmt(gross), ST["summary_v"]),
        Paragraph(_fmt(deductions_total), ST["summary_v"]),
        Paragraph(_fmt(net_pay), ST["summary_n"]),
    ]]

    t = Table(rows, colWidths=[col_w, col_w, col_w])
    _style_table([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("BACKGROUND", (0, 0), (-1, -1), NAVY_LIGHT),
        ("BOX", (0, 0), (-1, -1), 1, NAVY),
        ("LINEBELOW", (0, 0), (-1, 0), 0.5, BORDER),
        ("LINEAFTER", (0, 0), (0, -1), 0.5, BORDER),
        ("LINEAFTER", (1, 0), (1, -1), 0.5, BORDER),
    ])(t)
    return [t, Spacer(1, 18)]

def _build_signature_section(employee_signature_b64, company_name):
    sig_lbl = ST["sig_lbl"]
    emp_sig = _safe_b64_image(employee_signature_b64, 110, 30)
    if not emp_sig:
        emp_sig = Paragraph("_" * 34, sig_lbl)
    auth_sig = Paragraph("_" * 34, sig_lbl)
    col_w = USABLE_W / 2
    sig_data = [
        [emp_sig, auth_sig],
        [Paragraph("Employee Signature", sig_lbl),
         Paragraph(f"Authorized by \u2014 {company_name}", sig_lbl)],
    ]
    t = Table(sig_data, colWidths=[col_w, col_w])
    _style_table([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ])(t)
    return [t, Spacer(1, 14)]

def _build_footer(company_name):
    return [
        HRFlowable(width="100%", thickness=0.5, color=BORDER),
        Spacer(1, 5),
        Paragraph(
            f"This is a system-generated payslip. For queries, contact HR at {company_name}.",
            ST["footer"],
        ),
    ]


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
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=MARGIN_LR, rightMargin=MARGIN_LR,
        topMargin=MARGIN_TB, bottomMargin=MARGIN_TB,
    )
    elements = []
    elements.extend(_build_header(company_name, company_address, company_logo_b64, payslip_id, status))
    elements.extend(_build_employee_section(employee_name, employee_code, department, designation, period, paid_date))
    elements.extend(_build_earnings_deductions(earnings, deductions))
    earnings_total = sum(e["amount"] for e in earnings)
    deductions_total = sum(d["amount"] for d in deductions)
    elements.extend(_build_summary(earnings_total, deductions_total, net_pay, period))
    elements.extend(_build_signature_section(employee_signature_b64, company_name))
    elements.extend(_build_footer(company_name))
    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
