/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { patch } from "@web/core/utils/patch";
import { SelectCreateDialog } from "@web/views/view_dialogs/select_create_dialog";

patch(SelectCreateDialog.prototype, {
    onClickDialogSizeToggle() {
        if (this.env.dialogData) {
            this.env.dialogData.size =
                this.env.dialogData.size === "fs"
                    ? this.env.dialogData.initalSize
                    : "fs";
        }
    },
});
