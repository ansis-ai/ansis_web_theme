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

    @api.onchange("theme_color_palette")
    def _onchange_theme_color_palette(self):
        if self.theme_color_palette and self.theme_color_palette != "custom":
            self.theme_brand_color = PALETTES.get(self.theme_color_palette, "#0284c7")

    def action_reset_theme_color_assets(self):
        self._reset_theme_color_assets()
        return {
            "type": "ir.actions.client",
            "tag": "reload",
        }

    def _reset_theme_color_assets(self):
        assets_model = self.env["web_editor.assets"]
        primary_bundle = "web._assets_primary_variables"
        dark_bundle = "web.assets_web_dark"
        color_urls = (
            "/ansis_web_theme/static/src/scss/colors.scss",
            "/ansis_web_theme/static/src/scss/colors_dark.scss",
            "/ansis_web_theme/static/src/scss/variables.scss",
        )
        for url in color_urls:
            if "colors_dark" in url:
                assets_model.reset_color_asset(url, dark_bundle)
            else:
                assets_model.reset_color_asset(url, primary_bundle)
                assets_model.reset_color_asset(url, dark_bundle)
        self.env.registry.clear_cache("assets")
