/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { session } from "@web/session";
import { patch } from "@web/core/utils/patch";
import { Dialog } from "@web/core/dialog/dialog";

patch(Dialog.prototype, {
    setup() {
        super.setup();
        this.data.size =
            session.dialog_size !== "maximize" ? this.props.size : "fs";
        this.data.initalSize = this.props?.size || "lg";
    },
    onClickDialogSizeToggle() {
        this.data.size = this.data.size === "fs" ? this.data.initalSize : "fs";
    },
});
