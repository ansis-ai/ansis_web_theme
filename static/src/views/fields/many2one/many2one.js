/** @odoo-module **/
// Copyright 2017-2024 MuK IT GmbH & Co. KG
// Copyright 2024-2026 ANSIS Pte Ltd
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import { session } from "@web/session";
import { patch } from "@web/core/utils/patch";
import { many2OneField } from "@web/views/fields/many2one/many2one_field";

patch(many2OneField, {
    extractProps({ options }) {
        let res = super.extractProps(...arguments);
        if (
            session.disable_quick_create &&
            options.no_quick_create == undefined
        ) {
            res.canQuickCreate = false;
        }
        return res;
    }
});
