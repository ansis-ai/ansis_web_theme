/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { url } from "@web/core/utils/urls";
import { useService } from "@web/core/utils/hooks";
import { Component, onWillUnmount } from "@odoo/owl";

export class AppsBar extends Component {
    static template = "ansis_web_theme.AppsBar";
    static props = {};

    setup() {
        this.companyService = useService("company");
        this.appMenuService = useService("app_menu");

        if (this.companyService.currentCompany.has_appsbar_image) {
            this.sidebarImageUrl = url("/web/image", {
                model: "res.company",
                field: "appbar_image",
                id: this.companyService.currentCompany.id,
            });
        }

        const renderAfterMenuChange = () => {
            this.render();
        };

        this.env.bus.addEventListener("MENUS:APP-CHANGED", renderAfterMenuChange);
        onWillUnmount(() => {
            this.env.bus.removeEventListener("MENUS:APP-CHANGED", renderAfterMenuChange);
        });
    }

    _onAppClick(app) {
        return this.appMenuService.selectApp(app);
    }
}
