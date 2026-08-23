/** @odoo-module **/
// Copyright 2017-2024 MuK IT GmbH & Co. KG
// Copyright 2024-2026 ANSIS Pte Ltd
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import { patch } from '@web/core/utils/patch';
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";

patch(X2ManyField.prototype, {
    setup() {
        super.setup();
        if (this.canOpenRecord && !this.props.canOpen) {
            this.canOpenRecord = false;
        }
    },
});

patch(X2ManyField, {
    props: {
        ...X2ManyField.props,
        canOpen: { type: Boolean, optional: true },
    },
    defaultProps: {
        ...X2ManyField.defaultProps,
        canOpen: true,
    },
});

patch(x2ManyField, {
    extractProps({ options }) {
        let res = super.extractProps(...arguments);
        if ('no_open' in options) {
            res.canOpen = !options.no_open;
            delete options.no_open;
        }
        return res;
    }
});
