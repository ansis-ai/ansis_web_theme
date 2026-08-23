/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { registry } from "@web/core/registry";
import { user } from "@web/core/user";
import { computeAppsAndMenuItems, reorderApps } from "@web/webclient/menus/menu_helpers";

export const appMenuService = {
    dependencies: ["menu"],
    async start(env, { menu }) {
        return {
            getCurrentApp() {
                return menu.getCurrentApp();
            },
            getAppsMenuItems() {
                const menuItems = computeAppsAndMenuItems(
                    menu.getMenuAsTree("root")
                );
                const apps = menuItems.apps;
                const menuConfig = JSON.parse(
                    user.settings?.homemenu_config || "null"
                );
                if (menuConfig) {
                    reorderApps(apps, menuConfig);
                }
                return apps;
            },
            selectApp(app) {
                menu.selectMenu(app);
            },
        };
    },
};

registry.category("services").add("app_menu", appMenuService);
