# Copyright 2017-2024 MuK IT GmbH & Co. KG
# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

{
    "name": "ANSIS Web Theme",
    "summary": "Modern Light SaaS Backend Theme for Odoo Community 18.0",
    "description": """
        ANSIS Web Theme for Odoo 18.0 Community.
        Modern, responsive, high-performance web client theme.
        Originally derived from and incorporating architectural elements of MuK Backend Theme
        (Copyright MuK IT GmbH & Co. KG) under LGPL-3.0.
    """,
    "version": "18.0.1.0.0",
    "category": "Themes/Backend",
    "license": "LGPL-3",
    "author": "ANSIS Pte Ltd, MuK IT",
    "website": "https://ansis.com.sg",
    "contributors": [
        "ANSIS Pte Ltd <info@ansis.com.sg>",
        "Mathias Markl <mathias.markl@mukit.at>",
        "MuK IT GmbH & Co. KG <support@mukit.at>",
    ],
    "depends": [
        "mail",
        "web_editor",
    ],
    "excludes": [
        "web_enterprise",
    ],
    "data": [
        "templates/web_layout.xml",
        "views/res_config_settings.xml",
        "views/res_users.xml",
    ],
    "assets": {
        "web._assets_primary_variables": [
            (
                "prepend",
                "ansis_web_theme/static/src/scss/colors.scss",
            ),
            (
                "after",
                "web/static/src/scss/primary_variables.scss",
                "ansis_web_theme/static/src/scss/variables.scss",
            ),
        ],
        "web.assets_web_dark": [
            (
                "after",
                "ansis_web_theme/static/src/scss/colors.scss",
                "ansis_web_theme/static/src/scss/colors_dark.scss",
            ),
        ],
        "web.assets_backend": [
            "ansis_web_theme/static/src/scss/**/*.scss",
            "ansis_web_theme/static/src/core/**/*.scss",
            "ansis_web_theme/static/src/core/**/*.xml",
            "ansis_web_theme/static/src/core/**/*.js",
            "ansis_web_theme/static/src/webclient/**/*.xml",
            "ansis_web_theme/static/src/webclient/**/*.scss",
            "ansis_web_theme/static/src/webclient/**/*.js",
            "ansis_web_theme/static/src/views/**/*.scss",
            "ansis_web_theme/static/src/views/**/*.xml",
            "ansis_web_theme/static/src/views/**/*.js",
            (
                "after",
                "mail/static/src/chatter/web_portal/chatter.js",
                "ansis_web_theme/static/src/views/chatter/chatter.js",
            ),
            (
                "after",
                "mail/static/src/chatter/web/form_compiler.js",
                "ansis_web_theme/static/src/views/form/form_compiler.js",
            ),
        ],
    },
    "images": [
        "static/description/banner.png",
        "static/description/theme_screenshot.png",
    ],
    "installable": True,
    "application": False,
    "auto_install": False,
    "post_init_hook": "_setup_module",
    "uninstall_hook": "_uninstall_cleanup",
}
