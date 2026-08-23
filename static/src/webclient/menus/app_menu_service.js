/** @odoo-module **/
/*
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { registry } from "@web/core/registry";
import { user } from "@web/core/user";
import { computeAppsAndMenuItems } from "@web/webclient/menus/menu_helpers";

const serviceRegistry = registry.category("services");

if (serviceRegistry.contains("app_menu")) {
    const originalAppMenuService = serviceRegistry.get("app_menu");
    serviceRegistry.add(
        "app_menu",
        {
            ...originalAppMenuService,
            async start(env, deps) {
                const service = await originalAppMenuService.start(env, deps);
                return {
                    ...service,
                    getAppsMenuItems() {
                        const menu = deps.menu;
                        const menuItems = computeAppsAndMenuItems(
                            menu.getMenuAsTree("root")
                        );
                        const apps = menuItems.apps;

                        let savedOrder = null;
                        try {
                            const local = localStorage.getItem(
                                "ansis_apps_order"
                            );
                            if (local) {
                                savedOrder = JSON.parse(local);
                            } else if (user?.settings?.homemenu_config) {
                                savedOrder = JSON.parse(
                                    user.settings.homemenu_config
                                );
                            }
                        } catch (e) {
                            savedOrder = null;
                        }

                        if (Array.isArray(savedOrder) && savedOrder.length) {
                            apps.sort((a, b) => {
                                let aIdx = savedOrder.indexOf(a.xmlid);
                                if (aIdx === -1)
                                    aIdx = savedOrder.indexOf(a.id);
                                if (aIdx === -1)
                                    aIdx = savedOrder.indexOf(String(a.id));

                                let bIdx = savedOrder.indexOf(b.xmlid);
                                if (bIdx === -1)
                                    bIdx = savedOrder.indexOf(b.id);
                                if (bIdx === -1)
                                    bIdx = savedOrder.indexOf(String(b.id));

                                if (aIdx === -1 && bIdx === -1) return 0;
                                if (aIdx === -1) return 1;
                                if (bIdx === -1) return -1;
                                return aIdx - bIdx;
                            });
                        }
                        return apps;
                    },
                };
            },
        },
        { force: true }
    );
}
