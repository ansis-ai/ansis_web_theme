/** @odoo-module **/
// Copyright 2017-2024 MuK IT GmbH & Co. KG
// Copyright 2024-2026 ANSIS Pte Ltd
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import { registry } from '@web/core/registry';
import { exprToBoolean } from '@web/core/utils/strings';
import { SelectionField, selectionField } from '@web/views/fields/selection/selection_field';

export class SelectionIconsField extends SelectionField {
    static template = 'ansis_web_theme.SelectionIconsField';
    static props = {
        ...SelectionField.props,
        icons: { type: Object },
        noLabel: { type: Boolean, optional: true },
    };
    valueIcon(value) {
        return this.props.icons && this.props.icons[value] || '';
    }
}

export const selectionIconsField = {
    ...selectionField,
    component: SelectionIconsField,
    supportedTypes: ['selection'],
    listViewWidth: ({ hasLabel }) => (!hasLabel ? 20 : false),
    supportedOptions: [
        {
            label: 'Icons',
            name: 'icons',
            type: 'string',
        },
    ],
    extractProps({ attrs, options }) {
        const props = selectionField.extractProps(...arguments);
        props.noLabel = exprToBoolean(attrs.nolabel);
        props.icons = options.icons;
        return props;
    },
};

registry.category('fields').add('selection_icons', selectionIconsField);
