/** @odoo-module **/
// Copyright 2017-2024 MuK IT GmbH & Co. KG
// Copyright 2024-2026 ANSIS Pte Ltd
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import { registry } from "@web/core/registry";

import { BlockUIProgress } from "@ansis_web_theme/core/block_progress/block_progress_ui";

const mainComponentRegistry = registry.category("main_components");

export const blockProgressService = {
    start() {
        function block(data) {
            mainComponentRegistry.add(
                "BlockUIProgress",
                {
                    Component: BlockUIProgress,
                    props: {
                        totalSteps: data.totalSteps,
                        progressData: data.progressData,
                    },
                },
                { force: true }
            );
        }
        function unblock() {
            mainComponentRegistry.remove("BlockUIProgress");
        }
        return {
            block,
            unblock,
        };
    },
};

registry.category("services").add("block_progress", blockProgressService);
