/** @odoo-module **/
/*
    Copyright 2017-2024 MuK IT GmbH & Co. KG
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { registry } from "@web/core/registry";
import { session } from "@web/session";

const FONT_STACKS = {
    inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    jakarta: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    roboto: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    outfit: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

const FONT_SCALES = {
    compact: "13px",
    standard: "14px",
    comfortable: "15px",
};

const DENSITY_TOKENS = {
    compact: {
        rowHeight: "32px",
        cellPaddingY: "4px",
        controlPaddingY: "2px",
        formGap: "8px",
        sheetPadding: "16px 20px",
    },
    standard: {
        rowHeight: "40px",
        cellPaddingY: "8px",
        controlPaddingY: "6px",
        formGap: "14px",
        sheetPadding: "24px 32px",
    },
    comfortable: {
        rowHeight: "48px",
        cellPaddingY: "12px",
        controlPaddingY: "10px",
        formGap: "20px",
        sheetPadding: "32px 40px",
    },
};

function hexToRgb(hex) {
    if (!hex || typeof hex !== "string") return { r: 2, g: 132, b: 199 };
    let clean = hex.replace("#", "").trim();
    if (clean.length === 3) {
        clean = clean.split("").map((c) => c + c).join("");
    }
    const num = parseInt(clean, 16);
    if (isNaN(num)) return { r: 2, g: 132, b: 199 };
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

function adjustBrightness(r, g, b, factor) {
    return {
        r: Math.max(0, Math.min(255, Math.round(r * factor))),
        g: Math.max(0, Math.min(255, Math.round(g * factor))),
        b: Math.max(0, Math.min(255, Math.round(b * factor))),
    };
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export const ansisThemeService = {
    dependencies: ["company"],
    start(env, { company }) {
        function applyThemeTokens() {
            const currentCompanyId = company.currentCompany?.id || session.user_companies?.current_company;
            const allowedCompanies = session.user_companies?.allowed_companies || {};
            const companyData = allowedCompanies[currentCompanyId] || company.currentCompany || {};

            const fontKey = companyData.theme_font_family || "inter";
            const scaleKey = companyData.theme_font_size || "standard";
            const densityKey = companyData.theme_ui_density || "standard";
            const brandColorHex = companyData.theme_brand_color || "#0284c7";

            const root = document.documentElement;
            if (root) {
                // 1. Typography & Font Stacks
                const fontStack = FONT_STACKS[fontKey] || FONT_STACKS.inter;
                root.style.setProperty("--ansis-font-sans", fontStack);

                const fontSize = FONT_SCALES[scaleKey] || FONT_SCALES.standard;
                root.style.setProperty("--ansis-font-size-base", fontSize);

                // 2. UI Layout Density Tokens
                const density = DENSITY_TOKENS[densityKey] || DENSITY_TOKENS.standard;
                root.style.setProperty("--ansis-table-row-height", density.rowHeight);
                root.style.setProperty("--ansis-cell-padding-y", density.cellPaddingY);
                root.style.setProperty("--ansis-control-padding-y", density.controlPaddingY);
                root.style.setProperty("--ansis-form-gap", density.formGap);
                root.style.setProperty("--ansis-sheet-padding", density.sheetPadding);

                root.setAttribute("data-ansis-density", densityKey);
                if (document.body) {
                    document.body.setAttribute("data-ansis-density", densityKey);
                }

                // 3. Dynamic Brand Palette & Tints
                const rgb = hexToRgb(brandColorHex);
                const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
                const hoverRgb = adjustBrightness(rgb.r, rgb.g, rgb.b, 0.85);
                const hoverHex = rgbToHex(hoverRgb.r, hoverRgb.g, hoverRgb.b);

                root.style.setProperty("--ansis-primary", brandColorHex);
                root.style.setProperty("--ansis-primary-rgb", rgbStr);
                root.style.setProperty("--ansis-primary-hover", hoverHex);
                root.style.setProperty("--ansis-primary-light", `rgba(${rgbStr}, 0.08)`);
                root.style.setProperty("--ansis-primary-border", `rgba(${rgbStr}, 0.28)`);
                root.style.setProperty("--ansis-focus-ring", `rgba(${rgbStr}, 0.22)`);

                // Bootstrap & Odoo Core Brand Overrides
                root.style.setProperty("--bs-primary", brandColorHex);
                root.style.setProperty("--bs-primary-rgb", rgbStr);
                root.style.setProperty("--bs-link-color", brandColorHex);
                root.style.setProperty("--bs-link-hover-color", hoverHex);
                root.style.setProperty("--o-brand-primary", brandColorHex);
                root.style.setProperty("--o-brand-odoo", brandColorHex);
                root.style.setProperty("--o-action", brandColorHex);
                root.style.setProperty("--o-view-active-color", brandColorHex);
                root.style.setProperty("--o-navbar-badge-bg", brandColorHex);
            }
        }

        // Apply immediately upon startup
        applyThemeTokens();

        // Also re-apply if document head or body loads
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", applyThemeTokens);
        }

        return {
            applyThemeTokens,
        };
    },
};

registry.category("services").add("ansis_theme_service", ansisThemeService);
