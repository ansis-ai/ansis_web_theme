/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { patch } from "@web/core/utils/patch";
import { Thread } from "@mail/core/common/thread";

patch(Thread.prototype, {
    get orderedMessages() {
        let messages = super.orderedMessages;
        if (this.props.showNotificationMessages === false && messages) {
            messages = messages.filter(
                (msg) => !["user_notification", "notification"].includes(
                    msg.message_type
                )
            );
        }
        return messages;
    },
});

Thread.props = [
    ...Thread.props,
    "showNotificationMessages?",
];
Thread.defaultProps = {
    ...Thread.defaultProps,
    showNotificationMessages: true,
};
