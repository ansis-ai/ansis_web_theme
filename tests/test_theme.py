# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

from unittest.mock import MagicMock

from odoo.http import _request_stack
from odoo.tests import tagged
from odoo.tests.common import TransactionCase
from odoo.addons.ansis_web_theme.models.res_company import PALETTES
from odoo.addons.ansis_web_theme import _setup_module, _uninstall_cleanup


@tagged("post_install", "-at_install", "ansis_web_theme")
class TestThemeCompany(TransactionCase):

    def setUp(self):
        super().setUp()
        self.company = self.env["res.company"].create({
            "name": "Test ANSIS Company",
        })

    def test_company_theme_defaults(self):
        """Verify default theme settings on res.company."""
        self.assertEqual(self.company.theme_font_family, "inter")
        self.assertEqual(self.company.theme_font_size, "standard")
        self.assertEqual(self.company.theme_ui_density, "standard")
        self.assertEqual(self.company.theme_color_palette, "sapphire")
        self.assertEqual(self.company.theme_brand_color, "#0284c7")

    def test_company_theme_palette_onchange(self):
        """Verify onchange behavior when selecting preset palettes."""
        for palette_name, expected_color in PALETTES.items():
            self.company.theme_color_palette = palette_name
            self.company._onchange_theme_color_palette()
            self.assertEqual(
                self.company.theme_brand_color,
                expected_color,
                f"Palette {palette_name} did not update brand color to {expected_color}"
            )

    def test_company_theme_custom_palette(self):
        """Verify custom palette preserves custom hex code."""
        self.company.theme_color_palette = "custom"
        self.company.theme_brand_color = "#123456"
        self.company._onchange_theme_color_palette()
        self.assertEqual(self.company.theme_brand_color, "#123456")


@tagged("post_install", "-at_install", "ansis_web_theme")
class TestThemeConfigSettings(TransactionCase):

    def setUp(self):
        super().setUp()
        self.company = self.env.company

    def test_config_settings_theme_fields(self):
        """Verify reading and writing theme fields through res.config.settings."""
        settings = self.env["res.config.settings"].create({
            "theme_font_family": "jakarta",
            "theme_font_size": "compact",
            "theme_ui_density": "compact",
            "theme_color_palette": "emerald",
        })
        settings._onchange_theme_color_palette()
        settings.execute()

        self.assertEqual(self.company.theme_font_family, "jakarta")
        self.assertEqual(self.company.theme_font_size, "compact")
        self.assertEqual(self.company.theme_ui_density, "compact")
        self.assertEqual(self.company.theme_color_palette, "emerald")
        self.assertEqual(self.company.theme_brand_color, PALETTES["emerald"])

    def test_config_settings_reset_assets(self):
        """Verify action_reset_theme_color_assets and _reset_theme_color_assets."""
        settings = self.env["res.config.settings"].create({})
        action = settings.action_reset_theme_color_assets()
        self.assertEqual(action.get("type"), "ir.actions.client")
        self.assertEqual(action.get("tag"), "reload")


@tagged("post_install", "-at_install", "ansis_web_theme")
class TestThemeUsers(TransactionCase):

    def setUp(self):
        super().setUp()
        self.test_user = self.env["res.users"].create({
            "name": "Theme Test User",
            "login": "theme_test_user@example.com",
            "email": "theme_test_user@example.com",
            "groups_id": [(6, 0, [self.env.ref("base.group_user").id])],
        })

    def test_user_theme_preferences_defaults(self):
        """Verify default preferences on res.users."""
        self.assertEqual(self.test_user.chatter_position, "side")
        self.assertEqual(self.test_user.dialog_size, "minimize")
        self.assertEqual(self.test_user.sidebar_type, "invisible")

    def test_user_theme_preferences_writable(self):
        """Verify user can update their own theme preferences."""
        user_env = self.test_user.with_user(self.test_user)
        user_env.write({
            "chatter_position": "bottom",
            "dialog_size": "maximize",
            "sidebar_type": "small",
        })
        self.assertEqual(self.test_user.chatter_position, "bottom")
        self.assertEqual(self.test_user.dialog_size, "maximize")
        self.assertEqual(self.test_user.sidebar_type, "small")


@tagged("post_install", "-at_install", "ansis_web_theme")
class TestThemeIrHttp(TransactionCase):

    def test_ir_http_session_info_theme_keys(self):
        """Verify session_info includes theme configuration and parameters."""
        mock_request = MagicMock()
        mock_request.session.uid = self.env.user.id
        mock_request.session.can_save = False
        mock_request.env = self.env
        _request_stack.push(mock_request)
        try:
            session_data = self.env["ir.http"].with_user(self.env.user).session_info()
            self.assertIn("chatter_position", session_data)
            self.assertIn("dialog_size", session_data)
            self.assertIn("disable_quick_create", session_data)
            self.assertIn("user_companies", session_data)

            user_companies = session_data.get("user_companies", {})
            allowed_companies = user_companies.get("allowed_companies", {})
            current_company_id = self.env.company.id

            if current_company_id in allowed_companies:
                company_info = allowed_companies[current_company_id]
                self.assertIn("has_background_image", company_info)
                self.assertIn("theme_font_family", company_info)
                self.assertIn("theme_font_size", company_info)
                self.assertIn("theme_ui_density", company_info)
                self.assertIn("theme_color_palette", company_info)
                self.assertIn("theme_brand_color", company_info)
        finally:
            _request_stack.pop()


@tagged("post_install", "-at_install", "ansis_web_theme")
class TestThemeIrBinary(TransactionCase):

    def test_ir_binary_company_assets_access(self):
        """Verify _find_record_check_access allows sudo access for company assets."""
        ir_binary = self.env["ir.binary"]
        company = self.env.company

        for field in ("background_image", "favicon", "logo"):
            record = ir_binary._find_record_check_access(company, None, field=field)
            self.assertTrue(record.env.su, f"Expected sudo access for field {field}")


@tagged("post_install", "-at_install", "ansis_web_theme")
class TestThemeWebEditorAssets(TransactionCase):

    def test_scss_editor_variable_parsing(self):
        """Verify SCSS color variable extraction and replacement."""
        assets_model = self.env["web_editor.assets"]
        sample_scss = "$mk_color_brand: #0284c7;\n$ansis_primary: #0284c7;\n$other: #ffffff;"

        brand_val = assets_model._get_color_variable(sample_scss, "color_brand")
        self.assertEqual(brand_val, "#0284c7")

        primary_val = assets_model._get_color_variable(sample_scss, "primary")
        self.assertEqual(primary_val, "#0284c7")

        vars_dict = assets_model._get_color_variables(sample_scss, ["color_brand", "primary"])
        self.assertEqual(vars_dict, {
            "color_brand": "#0284c7",
            "primary": "#0284c7",
        })

        replaced_scss = assets_model._replace_color_variables(sample_scss, [
            {"name": "color_brand", "value": "#7c3aed"}
        ])
        self.assertIn("$color_brand: #7c3aed;", replaced_scss)


@tagged("post_install", "-at_install", "ansis_web_theme")
class TestThemeHooks(TransactionCase):

    def test_setup_and_cleanup_hooks(self):
        """Verify _setup_module and _uninstall_cleanup execute without errors."""
        _setup_module(self.env)
        _uninstall_cleanup(self.env)
