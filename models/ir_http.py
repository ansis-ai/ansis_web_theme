# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

from odoo import models


class IrHttp(models.AbstractModel):
    _inherit = "ir.http"

    def session_info(self):
        result = super().session_info()
        if self.env.user._is_internal():
            user_companies = result.get("user_companies", {})
            allowed_companies = user_companies.get("allowed_companies", {})
            for company in self.env.user.company_ids.with_context(
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
                            "theme_brand_color": company.theme_brand_color or "#0284c7",
                        }
                    )
            # Also update current_company dictionary if present
            current_company = user_companies.get("current_company")
            if current_company and current_company in allowed_companies:
                user_companies["current_company_theme"] = {
                    "theme_font_family": allowed_companies[current_company].get("theme_font_family", "inter"),
                    "theme_font_size": allowed_companies[current_company].get("theme_font_size", "standard"),
                    "theme_brand_color": allowed_companies[current_company].get("theme_brand_color", "#0284c7"),
                }
        return result
