# Copyright 2017-2024 MuK IT GmbH & Co. KG
# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

from odoo import models


class IrBinary(models.AbstractModel):
    _inherit = "ir.binary"

    def _find_record_check_access(self, record, access_token, field):
        if record._name == "res.company" and field in ("background_image", "favicon", "logo"):
            # sudo: unauthenticated / public users need read access to company
            # branding assets (favicon, logo, login/menu wallpaper) for the login
            # page and anonymous web routes, which would otherwise be blocked by
            # res.company record rules on unauthenticated requests.
            return record.sudo()
        return super()._find_record_check_access(record, access_token, field=field)
