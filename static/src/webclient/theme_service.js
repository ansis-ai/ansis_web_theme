/** @odoo-module **/

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

export const ansisThemeService = {
    dependencies: ["company"],
    start(env, { company }) {
        function applyThemeTypography() {
            const currentCompanyId = company.currentCompany?.id;
            const allowedCompanies = session.user_companies?.allowed_companies || {};
            const companyData = allowedCompanies[currentCompanyId] || company.currentCompany || {};

            const fontKey = companyData.theme_font_family || "inter";
            const scaleKey = companyData.theme_font_size || "standard";
            const brandColor = companyData.theme_brand_color || "#0284c7";

            const root = document.documentElement;
            if (root) {
                // Apply Font Family
                const fontStack = FONT_STACKS[fontKey] || FONT_STACKS.inter;
                root.style.setProperty("--ansis-font-sans", fontStack);

                // Apply Base Font Size Scale
                const fontSize = FONT_SCALES[scaleKey] || FONT_SCALES.standard;
                root.style.setProperty("--ansis-font-size-base", fontSize);

                // Apply Primary Brand Accent
                root.style.setProperty("--ansis-primary", brandColor);
            }
        }

        // Apply immediately upon startup
        applyThemeTypography();

        // Also re-apply if document head or body loads
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", applyThemeTypography);
        }

        return {
            applyThemeTypography,
        };
    },
};

registry.category("services").add("ansis_theme_service", ansisThemeService);
