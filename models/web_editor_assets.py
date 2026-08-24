# Copyright 2017-2024 MuK IT GmbH & Co. KG
# Copyright 2024-2026 ANSIS Pte Ltd
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).

import base64
import re
from odoo import api, fields, models
from odoo.tools import misc
from odoo.addons.base.models.assetsbundle import EXTENSIONS


class ScssEditor(models.AbstractModel):
    _inherit = "web_editor.assets"

    @api.model
    def _get_colors_attachment(self, custom_url):
        """Lookup the customized SCSS attachment by its *full customized URL*.

        `custom_url` is the URL returned by `_make_custom_asset_url(url, bundle)`
        (includes the bundle-specific suffix / hash), NOT the original module path.
        """
        return self.env["ir.attachment"].search([
            ("url", "=", custom_url)
        ])

    @api.model
    def _get_colors_asset(self, custom_url):
        """Lookup the override `ir.asset` record by its customized asset path.

        Takes the same `custom_url` format as `_get_colors_attachment`: the path
        produced by `_make_custom_asset_url`. Do NOT pass the original raw URL
        (e.g. `/ansis_web_theme/.../colors.scss`) — use `_make_custom_asset_url`
        first, or call `reset_color_asset(url, bundle)` which handles the
        conversion internally.
        """
        return self.env["ir.asset"].search([
            ("path", "=", custom_url)
        ])

    @api.model
    def _get_colors_from_url(self, url, bundle):
        """Return the SCSS source for `url`, preferring the customized version
        stored in `ir.attachment` if one exists for this (url, bundle) pair,
        otherwise falling back to the static file shipped with the module.
        """
        custom_url = self._make_custom_asset_url(url, bundle)
        url_info = self._get_data_from_url(custom_url)
        if url_info["customized"]:
            attachment = self._get_colors_attachment(custom_url)
            if attachment:
                return base64.b64decode(attachment.datas)
        with misc.file_open(url.strip("/"), "rb", filter_ext=EXTENSIONS) as f:
            return f.read()

    def _get_color_variable(self, content, variable):
        value = re.search(fr"\$(?:mk|ansis)?_?{variable}\:?\s(.*?);", content)
        return value and value.group(1)

    def _get_color_variables(self, content, variables):
        return {
            var: self._get_color_variable(content, var) 
            for var in variables
        }

    def _replace_color_variables(self, content, variables):
        for variable in variables:
            content = re.sub(
                fr"\$(?:mk|ansis)?_?{variable['name']}\:?\s(.*?);", 
                f"$mk_{variable['name']}: {variable['value']};", 
                content
            )
        return content

    @api.model
    def _save_color_asset(self, url, bundle, content):
        """Persist customized SCSS `content` as an override for the static file
        at `url` inside the given asset `bundle`.

        If an override already exists for (url, bundle), updates the existing
        `ir.attachment` in-place and clears the assets cache. Otherwise creates
        a new `ir.attachment` (holding the customized SCSS bytes) plus a
        corresponding `ir.asset` (directive="replace", target=original url) so
        the Odoo bundler injects our override instead of the static file.
        """
        custom_url = self._make_custom_asset_url(url, bundle)
        datas = base64.b64encode((content or "\n").encode("utf-8"))
        custom_attachment = self._get_colors_attachment(custom_url)
        if custom_attachment:
            custom_attachment.write({"datas": datas})
            self.env.registry.clear_cache("assets")
        else:
            attachment_values = {
                "name": url.split("/")[-1],
                "type": "binary",
                "mimetype": "text/scss",
                "datas": datas,
                "url": custom_url,
            }
            asset_values = {
                "path": custom_url,
                "target": url,
                "directive": "replace",
            }
            # Look up any PRE-EXISTING override (shouldn't happen because
            # _get_colors_attachment check above already handles it, but use
            # the proper customized URL to stay consistent with the exact-match
            # semantics fixed in Issue #3).
            target_asset = self._get_colors_asset(custom_url)
            if target_asset:
                asset_values["name"] = "%s override" % target_asset.name
                asset_values["bundle"] = target_asset.bundle
                asset_values["sequence"] = target_asset.sequence
            else:
                asset_values["name"] = "%s: replace %s" % (
                    bundle, custom_url.split("/")[-1]
                )
                asset_values["bundle"] = self.env["ir.asset"]._get_related_bundle(
                    url, bundle
                )
            self.env["ir.attachment"].create(attachment_values)
            self.env["ir.asset"].create(asset_values)

    def get_color_variables_values(self, url, bundle, variables):
        """Read current values of SCSS `variables` from the (possibly customized)
        SCSS source at `url` in the context of `bundle`.
        """
        content = self._get_colors_from_url(url, bundle)
        return self._get_color_variables(
            content.decode("utf-8"), variables
        )

    def replace_color_variables_values(self, url, bundle, variables):
        """Write new values for SCSS `variables` into the customized override
        for `url` / `bundle`, creating one if needed (first customization).
        """
        original = self._get_colors_from_url(url, bundle).decode("utf-8")
        content = self._replace_color_variables(original, variables)
        self._save_color_asset(url, bundle, content)

    def reset_color_asset(self, url, bundle):
        """Delete any customized SCSS override for (`url`, `bundle`).

        Accepts the ORIGINAL static file URL (e.g.
        `/ansis_web_theme/static/src/scss/colors.scss`) and builds the
        customized URL internally — callers do NOT need to pre-build
        `custom_url` themselves (consistent with `_save_color_asset`).
        """
        custom_url = self._make_custom_asset_url(url, bundle)
        self._get_colors_attachment(custom_url).unlink()
        self._get_colors_asset(custom_url).unlink()
