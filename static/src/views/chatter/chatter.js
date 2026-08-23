/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { patch } from "@web/core/utils/patch";
import { browser } from "@web/core/browser/browser";

import { Chatter } from "@mail/chatter/web_portal/chatter";

patch(Chatter.prototype, {
    setup() {
        super.setup();
        const showNotificationMessages = browser.localStorage.getItem(
            "ansis_web_theme.notifications"
        ) || browser.localStorage.getItem("muk_web_chatter.notifications");
        this.state.showNotificationMessages = (
            showNotificationMessages != null ? 
            JSON.parse(showNotificationMessages) : true
        );
    },
    onClickNotificationsToggle() {
        const showNotificationMessages = !this.state.showNotificationMessages;
        browser.localStorage.setItem(
            "ansis_web_theme.notifications", showNotificationMessages
        );
        browser.localStorage.setItem(
            "muk_web_chatter.notifications", showNotificationMessages
        );
        this.state.showNotificationMessages = showNotificationMessages;
    },
});
