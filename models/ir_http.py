# Copyright 2017-2024 MuK IT GmbH & Co. KG
# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

from odoo import models
from odoo.tools import str2bool


class IrHttp(models.AbstractModel):
    _inherit = "ir.http"

    def session_info(self):
        result = super().session_info()
        result["chatter_position"] = self.env.user.chatter_position or "side"
        result["dialog_size"] = self.env.user.dialog_size or "minimize"
        get_param = self.env["ir.config_parameter"].sudo().get_param
        result["disable_quick_create"] = str2bool(
            get_param("ansis_web_theme.disable_quick_create")
            or get_param("muk_web_utils.disable_quick_create", default=""),
            default=False,
        )
        if self.env.user._is_internal():
            user_companies = result.get("user_companies", {})
            allowed_companies = user_companies.get("allowed_companies", {})
            for company in self.env.user.company_ids.sudo().with_context(
                bin_size=True
            ):
                if company.id in allowed_companies:
                    allowed_companies[company.id].update(
                        {
                            "has_background_image": bool(
                                company.background_image
                            ),
                            "theme_font_family": company.theme_font_family or "inter",
                            "theme_font_size": company.theme_font_size or "standard",
                            "theme_ui_density": company.theme_ui_density or "standard",
                            "theme_color_palette": company.theme_color_palette or "sapphire",
                            "theme_brand_color": company.theme_brand_color or "#0284c7",
                        }
                    )
            # Also update current_company dictionary if present
            current_company = user_companies.get("current_company")
            if current_company and current_company in allowed_companies:
                user_companies["current_company_theme"] = {
                    "has_background_image": allowed_companies[current_company].get("has_background_image", False),
                    "theme_font_family": allowed_companies[current_company].get("theme_font_family", "inter"),
                    "theme_font_size": allowed_companies[current_company].get("theme_font_size", "standard"),
                    "theme_ui_density": allowed_companies[current_company].get("theme_ui_density", "standard"),
                    "theme_color_palette": allowed_companies[current_company].get("theme_color_palette", "sapphire"),
                    "theme_brand_color": allowed_companies[current_company].get("theme_brand_color", "#0284c7"),
                }
        return result
