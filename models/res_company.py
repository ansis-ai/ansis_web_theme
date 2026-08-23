# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

from odoo import fields, models


class ResCompany(models.Model):
    _inherit = "res.company"

    favicon = fields.Binary(string="Company Favicon", attachment=True)
    background_image = fields.Binary(
        string="Apps Menu Background Image", attachment=True
    )

    theme_font_family = fields.Selection(
        selection=[
            ("inter", "Inter (Modern SaaS Default)"),
            ("jakarta", "Plus Jakarta Sans (Geometric)"),
            ("roboto", "Roboto (Clean Enterprise)"),
            ("outfit", "Outfit (Modern Rounded)"),
            ("system", "System Default (-apple-system / BlinkMacSystemFont)"),
        ],
        default="inter",
        string="Theme Font Family",
        help="Primary typography family applied across the backend interface.",
    )

    theme_font_size = fields.Selection(
        selection=[
            ("compact", "Compact (13px Base)"),
            ("standard", "Standard (14px Base)"),
            ("comfortable", "Comfortable (15px Base)"),
        ],
        default="standard",
        string="Theme Font Scale",
        help="Base font sizing across views and controls.",
    )

    theme_ui_density = fields.Selection(
        selection=[
            ("compact", "Compact (High Density / 32px Rows)"),
            ("standard", "Standard (Balanced / 40px Rows)"),
            ("comfortable", "Comfortable (Spacious / 48px Rows)"),
        ],
        default="standard",
        string="UI Layout Density",
        help="Controls row height in tables, form field padding, and layout density.",
    )

    theme_brand_color = fields.Char(
        string="Primary Brand Accent",
        default="#0284c7",
        help="Accent color for active buttons, tabs, links, and focus rings.",
    )
