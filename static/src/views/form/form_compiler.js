/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { session } from "@web/session";
import { patch } from "@web/core/utils/patch";
import { append, createElement, setAttributes } from "@web/core/utils/xml";

import { FormCompiler } from "@web/views/form/form_compiler";

patch(FormCompiler.prototype, {
    compile(node, params) {
        const res = super.compile(node, params);
        const chatterContainerHookXml = res.querySelector(
            ".o_form_renderer > .o-mail-Form-chatter"
        );
        if (!chatterContainerHookXml) {
            return res;
        }
        setAttributes(chatterContainerHookXml, {
            "t-ref": "chatterContainer",
        });
        if (session.chatter_position === "bottom") {
            const formSheetBgXml = res.querySelector(".o_form_sheet_bg");
            if (!chatterContainerHookXml || !formSheetBgXml?.parentNode) {
                return res;
            }
            const webClientViewAttachmentViewHookXml = res.querySelector(
                ".o_attachment_preview"
            );
            const chatterContainerXml = chatterContainerHookXml.querySelector(
                "t[t-component='__comp__.mailComponents.Chatter']"
            );
            const sheetBgChatterContainerHookXml = chatterContainerHookXml.cloneNode(true);
            const sheetBgChatterContainerXml = sheetBgChatterContainerHookXml.querySelector(
                "t[t-component='__comp__.mailComponents.Chatter']"
            );
            sheetBgChatterContainerHookXml.classList.add("o-isInFormSheetBg", "w-auto");
            append(formSheetBgXml, sheetBgChatterContainerHookXml);
            setAttributes(sheetBgChatterContainerXml, {
                isInFormSheetBg: "true",
                isChatterAside: "false",
            });
            setAttributes(chatterContainerXml, {
                isInFormSheetBg: "true",
                isChatterAside: "false",
            });
            setAttributes(chatterContainerHookXml, {
                "t-if": "false",
            });
            if (webClientViewAttachmentViewHookXml) {
                setAttributes(webClientViewAttachmentViewHookXml, {
                    "t-if": "false",
                });
            }
        } else {
            setAttributes(chatterContainerHookXml, {
                "t-att-style": '__comp__.chatterState.width ? `width: ${__comp__.chatterState.width}px;` : ""',
            });
            const chatterContainerResizeHookXml = createElement("span");
            chatterContainerResizeHookXml.classList.add("mk_chatter_resize", "ansis_chatter_resize");
            setAttributes(chatterContainerResizeHookXml, {
                "t-on-mousedown.stop.prevent": "__comp__.onStartChatterResize.bind(__comp__)",
                "t-on-dblclick.stop.prevent": "__comp__.onDoubleClickChatterResize.bind(__comp__)",
            });
            append(chatterContainerHookXml, chatterContainerResizeHookXml);
        }
        return res;
    },
});
