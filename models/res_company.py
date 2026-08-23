# Copyright 2017-2024 MuK IT GmbH & Co. KG
# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

from odoo import api, fields, models

PALETTES = {
    "sapphire": "#0284c7",
    "violet": "#7c3aed",
    "emerald": "#059669",
    "amber": "#ea580c",
    "crimson": "#e11d48",
    "teal": "#0d9488",
    "slate": "#334155",
    "rose": "#db2777",
}


class ResCompany(models.Model):
    _inherit = "res.company"

    favicon = fields.Binary(string="Company Favicon", attachment=True)
    background_image = fields.Binary(
        string="Apps Menu Background Image", attachment=True
    )
    appbar_image = fields.Binary(
        string="Apps Menu Footer Image", attachment=True
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

    theme_color_palette = fields.Selection(
        selection=[
            ("sapphire", "Sapphire Blue (#0284c7)"),
            ("violet", "Royal Violet (#7c3aed)"),
            ("emerald", "Emerald Green (#059669)"),
            ("amber", "Sunset Amber (#ea580c)"),
            ("crimson", "Crimson Red (#e11d48)"),
            ("teal", "Ocean Teal (#0d9488)"),
            ("slate", "Modern Slate (#334155)"),
            ("rose", "Berry Rose (#db2777)"),
            ("custom", "Custom Hex Color"),
        ],
        default="sapphire",
        string="Brand Color Palette",
        help="Select a curated theme color preset or enter a custom hex color.",
    )

    theme_brand_color = fields.Char(
        string="Primary Brand Accent",
        default="#0284c7",
        help="Accent color for active buttons, tabs, links, and focus rings.",
    )

    @api.onchange("theme_color_palette")
    def _onchange_theme_color_palette(self):
        if self.theme_color_palette and self.theme_color_palette != "custom":
            self.theme_brand_color = PALETTES.get(self.theme_color_palette, "#0284c7")
