/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { useState, useRef } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { browser } from "@web/core/browser/browser";

import { FormRenderer } from "@web/views/form/form_renderer";

patch(FormRenderer.prototype, {
    setup() {
        super.setup();
        this.chatterState = useState({
            width: browser.localStorage.getItem("ansis_web_theme.chatter_width") || browser.localStorage.getItem("muk_web_chatter.width"),
        });
        this.chatterContainer = useRef("chatterContainer");
    },
    onStartChatterResize(ev) {
        if (ev.button !== 0) {
            return;
        }
        const initialX = ev.pageX;
        const chatterElement = this.chatterContainer.el;
        if (!chatterElement) {
            return;
        }
        const initialWidth = chatterElement.offsetWidth;
        const resizeStoppingEvents = ["keydown", "mousedown", "mouseup"];
        const resizePanel = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const newWidth = Math.min(
                Math.max(50, initialWidth - (ev.pageX - initialX)),
                Math.max(chatterElement.parentElement.offsetWidth - 250, 250)
            );
            browser.localStorage.setItem("ansis_web_theme.chatter_width", newWidth);
            browser.localStorage.setItem("muk_web_chatter.width", newWidth);
            this.chatterState.width = newWidth;
        };
        const stopResize = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            if (ev.type === "mousedown" && ev.button === 0) {
                return;
            }
            document.removeEventListener("mousemove", resizePanel, true);
            resizeStoppingEvents.forEach((stoppingEvent) => {
                document.removeEventListener(stoppingEvent, stopResize, true);
            });
            if (document.activeElement) {
                document.activeElement.blur();
            }
        };
        document.addEventListener("mousemove", resizePanel, true);
        resizeStoppingEvents.forEach((stoppingEvent) => {
            document.addEventListener(stoppingEvent, stopResize, true);
        });
    },
    onDoubleClickChatterResize(ev) {
        browser.localStorage.removeItem("ansis_web_theme.chatter_width");
        browser.localStorage.removeItem("muk_web_chatter.width");
        this.chatterState.width = false;
    },
});
