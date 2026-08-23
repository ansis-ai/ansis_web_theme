/** @odoo-module **/
// Copyright 2017-2024 MuK IT GmbH & Co. KG
// Copyright 2024-2026 ANSIS Pte Ltd
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import { registry } from "@web/core/registry";
import { imageField } from '@web/views/fields/image/image_field';

export const listImageField = {
    ...imageField,
    listViewWidth: ({ hasLabel }) => (!hasLabel ? 30 : false),
};

registry.category('fields').add('list.image', listImageField);
