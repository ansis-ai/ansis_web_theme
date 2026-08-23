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


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    # ----------------------------------------------------------
    # Company Theme Fields
    # ----------------------------------------------------------

    theme_favicon = fields.Binary(related="company_id.favicon", readonly=False)

    theme_background_image = fields.Binary(
        related="company_id.background_image", readonly=False
    )

    appbar_image = fields.Binary(
        related="company_id.appbar_image", readonly=False
    )

    theme_font_family = fields.Selection(
        related="company_id.theme_font_family", readonly=False
    )

    theme_font_size = fields.Selection(
        related="company_id.theme_font_size", readonly=False
    )

    theme_ui_density = fields.Selection(
        related="company_id.theme_ui_density", readonly=False
    )

    theme_color_palette = fields.Selection(
        related="company_id.theme_color_palette", readonly=False
    )

    theme_brand_color = fields.Char(
        related="company_id.theme_brand_color", readonly=False
    )

    theme_color_appsmenu_text = fields.Char(string="Apps Menu Text Color")
    theme_color_appbar_text = fields.Char(string="AppsBar Text Color")
    theme_color_appbar_active = fields.Char(string="AppsBar Active Color")
    theme_color_appbar_background = fields.Char(string="AppsBar Background Color")

    @api.onchange("theme_color_palette")
    def _onchange_theme_color_palette(self):
        if self.theme_color_palette and self.theme_color_palette != "custom":
            self.theme_brand_color = PALETTES.get(self.theme_color_palette, "#0284c7")

    def action_reset_theme_color_assets(self):
        return {
            "type": "ir.actions.client",
            "tag": "reload",
        }
