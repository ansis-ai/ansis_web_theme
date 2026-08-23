# Copyright 2017-2024 MuK IT GmbH & Co. KG
# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

from odoo import fields, models


class ResUsers(models.Model):
    _inherit = "res.users"

    @property
    def SELF_READABLE_FIELDS(self):
        return super().SELF_READABLE_FIELDS + [
            "chatter_position",
            "dialog_size",
        ]

    @property
    def SELF_WRITEABLE_FIELDS(self):
        return super().SELF_WRITEABLE_FIELDS + [
            "chatter_position",
            "dialog_size",
        ]

    chatter_position = fields.Selection(
        selection=[
            ("side", "Side"),
            ("bottom", "Bottom"),
        ],
        string="Chatter Position",
        default="side",
        required=True,
        help="Position of the chatter panel relative to the main form view sheet.",
    )

    dialog_size = fields.Selection(
        selection=[
            ("minimize", "Standard (Minimize)"),
            ("maximize", "Fullscreen (Maximize)"),
        ],
        string="Dialog Size",
        default="minimize",
        required=True,
        help="Default display size when opening modal dialogs and wizards.",
    )
