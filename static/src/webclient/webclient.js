/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { patch } from "@web/core/utils/patch";
import { WebClient } from "@web/webclient/webclient";
import { AppsBar } from "@ansis_web_theme/webclient/appsbar/appsbar";

patch(WebClient, {
    components: {
        ...WebClient.components,
        AppsBar,
    },
});
