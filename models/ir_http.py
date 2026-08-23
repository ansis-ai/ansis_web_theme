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
                        }
                    )
        return result
