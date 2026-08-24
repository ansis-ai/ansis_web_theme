# Copyright 2017-2024 MuK IT GmbH & Co. KG
# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import base64

from odoo.tools import file_open

from . import models


def _setup_module(env):
    with file_open("web/static/img/favicon.ico", "rb") as favicon_file:
        favicon = base64.b64encode(favicon_file.read())
    with file_open(
        "ansis_web_theme/static/src/img/background.svg", "rb"
    ) as background_file:
        background = base64.b64encode(background_file.read())
    # Apply default branding to every company (not just main_company) so that
    # multi-company instances see consistent favicon / menu wallpaper when
    # switching companies after fresh module install.
    for company in env["res.company"].with_context(active_test=False).search([]):
        if not company.favicon:
            company.favicon = favicon
        if not company.background_image:
            company.background_image = background


def _uninstall_cleanup(env):
    env["res.config.settings"]._reset_theme_color_assets()
