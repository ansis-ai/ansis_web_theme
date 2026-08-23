# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

from odoo import fields, models


class ResCompany(models.Model):
    _inherit = "res.company"

    favicon = fields.Binary(string="Company Favicon", attachment=True)
    background_image = fields.Binary(
        string="Apps Menu Background Image", attachment=True
    )
