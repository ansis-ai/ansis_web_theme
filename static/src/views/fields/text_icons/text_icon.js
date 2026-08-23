/** @odoo-module **/
// Copyright 2017-2024 MuK IT GmbH & Co. KG
// Copyright 2024-2026 ANSIS Pte Ltd
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import { registry } from '@web/core/registry';
import { usePopover } from "@web/core/popover/popover_hook";
import { standardFieldProps } from '@web/views/fields/standard_field_props';
import { Component, useRef } from '@odoo/owl';
import { Tooltip } from "@web/core/tooltip/tooltip";

export class TextIconField extends Component {
    static template = 'ansis_web_theme.TextIconField';
    static props = {
        ...standardFieldProps,
        icon: { type: String, optional: true },
    };
    static defaultProps = {
        icon: 'file-text-o',
    };
    setup() {
        super.setup();
        this.iconRef = useRef('icon');
        this.popover = usePopover(Tooltip);
    }
    get hasValue() {
        const value = this.props.record.data[this.props.name];
        return !(value === undefined || value === false || value == '');
    }
    showTooltip() {
        this.popover.open(this.iconRef.el, { 
            template: 'ansis_web_theme.TextValueTooltip',
            info: {
                value: this.props.record.data[this.props.name] 
            }
        });
    }
}

export const textIconField = {
    component: TextIconField,
    listViewWidth: ({ hasLabel }) => (!hasLabel ? 20 : false),
    supportedOptions: [
        {
            label: 'Icon',
            name: 'icon',
            type: 'string',
        },
    ],
    supportedTypes: ['html', 'text', 'char'],
    extractProps: ({ options }) => ({
        icon: options.icon,
    }),
};

registry.category('fields').add('text_icon', textIconField);
