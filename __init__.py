# Copyright 2017-2024 MuK IT GmbH & Co. KG
# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import base64

from odoo.tools import file_open

from . import models


def _setup_module(env):
    if env.ref("base.main_company", False):
        with file_open("web/static/img/favicon.ico", "rb") as file:
            env.ref("base.main_company").write(
                {"favicon": base64.b64encode(file.read())}
            )
        with file_open(
            "ansis_web_theme/static/src/img/background.svg", "rb"
        ) as file:
            env.ref("base.main_company").write(
                {"background_image": base64.b64encode(file.read())}
            )


def _uninstall_cleanup(env):
    env["res.config.settings"]._reset_theme_color_assets()
