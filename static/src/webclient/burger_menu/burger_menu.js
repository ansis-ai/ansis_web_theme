/** @odoo-module **/

import { BurgerMenu } from "@web/webclient/burger_menu/burger_menu";
import { patch } from "@web/core/utils/patch";

patch(BurgerMenu.prototype, {
    setup() {
        super.setup();
    },

    _openHomeMenu() {
        this._closeBurger();
        // Trigger Home Menu open via global brand click or bus event
        const brand = document.querySelector(".o_menu_brand");
        if (brand) {
            brand.click();
        } else {
            this.env.bus?.trigger("HOME-MENU:TOGGLE");
        }
    },

    get currentCompanyName() {
        return this.company?.currentCompany?.name || "";
    },
});
