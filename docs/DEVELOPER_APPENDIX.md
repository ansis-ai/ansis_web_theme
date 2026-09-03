# ansis_web_theme — Developer Appendix

> **Audience:** Odoo developers, maintainers, QA engineers, and technical integrators.
>
> **Goal:** Pure technical reference material for `ansis_web_theme`. End users should never need this file; see `readme/USAGE.rst` and `readme/CONFIGURE.rst` instead.
>
> **Target version:** 18.0.1.2.0 (September 2026). Lines-of-code references from the `2026-09-03` checkout.

---

## 5.1 Python Public Method Reference (12 methods)

All colors-related public helpers live in `web_editor_assets.py`; the settings/ORM layer helpers live in `res_config_settings.py`; module hooks live in the module `__init__.py`.

| Method | File + Line Range | Parameters | Returns | Purpose |
|---|---|---|---|---|
| `_get_color_variable` | `models/web_editor_assets.py` L55-L57 | `content: str`, `variable: str` | `str \| None` | Extracts the current value of a SCSS color variable via a healing regex. Tolerates `$mk_` / `$ansis_` / NO prefix so it reads legacy corrupted overrides and heals them on the next write. |
| `_replace_color_variables` | `models/web_editor_assets.py` L65-L72 | `content: str`, `variables: list[dict]` each with `name` and `value` keys | `str` | Replaces every variable in the input list. ALWAYS writes the canonical `$mk_` prefix into the output so the read-side regex keeps matching on every subsequent save round-trip. |
| `_get_colors_attachment` | `models/web_editor_assets.py` L16-L24 | `custom_url: str` | `ir.attachment` recordset (possibly empty) | Exact-match lookup via the `url = custom_url` field. Symmetric behavior with `_get_colors_asset`. |
| `_get_colors_asset` | `models/web_editor_assets.py` L27-L38 | `custom_url: str` | `ir.asset` recordset (possibly empty) | Same exact `=` match. **Historical note Issue #3:** Previous code used a `like` substring match, which could mutate or delete UNRELATED `ir.asset` rows when a URL substring accidentally collided with another module's customized asset. Replaced with `=` exact match in 18.0.1.1.0. |
| `_make_custom_asset_url` | `models/web_editor_assets.py` (inherited via `web_editor.assets`) | `url: str`, `bundle: str` | `str` | Builds the suffixed "custom URL" used for every customized-asset lookup. Adds a trailing bundle-token so the same base SCSS file overridden in two different bundles gets two separate `ir.attachment` rows. |
| `_save_color_asset` | `models/web_editor_assets.py` L75-L121 | `url: str`, `bundle: str`, `content: str` | `None` | Idempotently saves a customized SCSS override. If a matching attachment already exists, it updates it in place; otherwise it creates a new `ir.attachment` row and a corresponding `ir.asset` row pointing to it. **Historical note Issue #9 (latent bug):** In 18.0.1.0.0 the code called `_get_colors_asset(asset_url)` with a leading-slash-stripped URL, which due to Issue #3's LIKE operator happened to work by accident. After Issue #3 converted to exact `=`, this bug became a guaranteed miss → fixed by calling `_get_colors_asset(custom_url)` instead. |
| `get_color_variables_values` | `models/web_editor_assets.py` L123-L130 | `self`, `url: str`, `bundle: str`, `variables: list[str]` | `dict[str, str]` — keys are the variable names passed in | Reads the current SCSS values from the (possibly customized) SCSS source at `url` in the context of `bundle`. Used by the settings form layer to pre-populate the Theme & Branding → Brand Palette color form for both light (web._assets_primary_variables) and dark (web.assets_web_dark) bundles. |
| `_onchange_theme_color_palette` | `models/res_config_settings.py` L43-L46 | trigger: `theme_color_palette` field changes (on `self`) | Odoo onchange side-effect (writes to `self.theme_brand_color`) | Looks up the user's selected palette in the `PALETTES` single-source-of-truth dict (in `models/__init__.py`) and assigns the matching hex to the Hex Accent Code field so it auto-populates. Custom = no-op; the user picks hex via the swatch. |
| `action_reset_theme_color_assets` | `models/res_config_settings.py` L48-L53 | `self` (any res.config.settings record; model-level env-only call also works) | `{'type': 'ir.actions.client', 'tag': 'reload'}` | UI button handler. Calls `_reset_theme_color_assets()` first to actually delete database rows, THEN returns the client-reload tag. **Historical note Issue #1:** In 18.0.1.0.0 this method returned only the reload tag without deleting anything; the companion method below also didn't exist, so the uninstall hook crashed. |
| `_reset_theme_color_assets` | `models/res_config_settings.py` L55-L70 | `self` (model-level env-only call is fine, no specific record needed) | `None` | Loops through 3 core SCSS files × 2 asset bundles (light + dark) for a total of 6 custom URLs. For each URL it searches both `ir.attachment` (via `_get_colors_attachment`) and `ir.asset` (via `_get_colors_asset`) and deletes the rows if they exist. Used by both the Reset Custom Theme Assets button AND the uninstall hook. |
| `_setup_module` | `__init__.py` L12-L26 | `env` (raw Odoo environment, not a cursor) | `None` | **`post_init_hook`**. Reads the two static binary branding assets (wallpaper + favicon) from `static/src/img` into memory ONCE, then iterates ALL companies in the database including archived ones (via `with_context(active_test=False).search([])`) and writes `favicon` / `background_image` only if the target field is empty (so pre-existing customizations are preserved on upgrade or re-install). **Historical note Issue #5:** before 18.0.1.1.0 this only set `base.main_company`, so multi-company installs got inconsistent branding on company #2+. |
| `_uninstall_cleanup` | `__init__.py` L29-L30 | `env` | `None` | **`uninstall_hook`**. Calls `env['res.config.settings']._reset_theme_color_assets()` to guarantee zero leftover SCSS customizations in the database after module removal. **Historical note Issue #1:** before 18.0.1.1.0 this crashed with `AttributeError` because `_reset_theme_color_assets` had not yet been added to the model. |

---

## 5.2 Session-Info Reference (serialized for JS hooks)

Four groups of keys are added or extended by this module inside `session_info` on every HTTP response that delivers the web client. These keys are consumed by the OWL theme-service, chatter widget patcher, dialog system, and the custom binary widget extensions.

| Key path | Type | Where set | Purpose |
|---|---|---|---|
| `session_info.chatter_position` | `'side' \| 'bottom'` | `models/ir_http.py` L14 session_info override read from `self.env.user.chatter_position` | OWL chatter renderer decides whether to draw a horizontal split-screen or a classic under-form panel. |
| `session_info.dialog_size` | `'minimize' \| 'maximize'` | `models/ir_http.py` L15 same session_info override | Default size state applied to every new `Dialog` + `SelectCreateDialog` instance in the web client. |
| `session_info.disable_quick_create` | `bool` | `models/ir_http.py` L16-L25 — reads `ansis_web_theme.disable_quick_create` system param via `sudo().get_param()`, falls back to legacy Muk `muk_web_utils.disable_quick_create` param if the ANSIS one is absent | Global Many2One Quick-Create widget override. Set to `"1"` on the system parameter to globally disable Quick-Create arrows for all users. |
| `session_info.user_companies.allowed_companies[id]` (extended dict) | `dict` with keys injected per company: `has_background_image:bool`, `theme_font_family:str`, `theme_font_size:str`, `theme_ui_density:str`, `theme_color_palette:str`, `theme_brand_color:str` | `models/ir_http.py` L26-L62; iterates `self.env.user.company_ids.sudo().with_context(bin_size=True)` | Provides branding/theme tokens for EVERY company in the switchable set so the JS theme service doesn't have to re-read on every company switch. The dict blob is extended per-company in-place. `bin_size=True` avoids streaming binary blob bytes over the wire (we only need boolean "is there a wallpaper set?" via truthiness plus the scalar string fields). `current_company_theme` mirror is also written to `user_companies` for the active company. |

---

## 5.3 SCSS Variable Naming & Asset Bundles

### SCSS primary variable conventions

Three prefix shapes exist or are reserved by the regex engine in `_get_color_variable` / `_replace_color_variables`:

- **Canonical written form.** Every save writes variables as: `$mk_color_<name>`. The 8 primary color names are: `brand`, `primary`, `secondary`, `success`, `info`, `warning`, `danger`, `alpha`.
- **Fallback read form.** On-disk static SCSS sources use the unprefixed: `$color_<name>`. The healing regex also tolerates this shape so both the source files and any legacy corrupted overrides (those that lost their prefix under Issue #2) remain readable.
- **Reserved future alias.** `$ansis_color_<name>` (fork rename from MuK → ANSIS). Dead today — the on-disk SCSS files have not been renamed to the `ansis_` prefix yet. The regex already covers this shape so that a future SCSS-wide rename will be zero-code-change: the read side will start matching the new names; the write side (currently `$mk_`) will simply be switched to `$ansis_` when the SCSS sources and the replacement template are swapped in a follow-up commit.

### 3 core SCSS files overridden at runtime

Every palette save or reset operation works on these exact 3 source files:
1. `static/src/scss/colors.scss` — light-mode palette primaries and the `$mk_color_*` aliases.
2. `static/src/scss/colors_dark.scss` — dark-mode palette overrides.
3. `static/src/scss/variables.scss` — font-family stack, density/scale numbers, list row heights, non-color tokens.

### Asset bundles (2 involved in customization override + 1 for all JS+widgets)

| Bundle | Declaration order in `__manifest__.py` assets key |
|---|---|
| `web._assets_primary_variables` | 1. `prepend` → `static/src/scss/colors.scss` <br> 2. `after web/static/src/scss/primary_variables.scss` → `static/src/scss/variables.scss` |
| `web.assets_web_dark` | `after ansis_web_theme/static/src/scss/colors.scss` → `static/src/scss/colors_dark.scss` |
| `web.assets_backend` | Bulk includes via glob: `**/*.scss` (chatter patcher styles, list, form, widgets, core dialog, webclient), `**/*.xml` (all OWL templates), `**/*.js` (widget patches, session_info consumers, theme service, dialog + chatter behavior). Plus two specific `after` directives: chatter.js after mail's chatter, and form_compiler.js after mail's form_compiler. |

---

## 5.4 Model Field Maps we Extend

This module does NOT create any brand-new standalone `_name` models — it only uses `_inherit` against pre-existing models from Odoo core (`base`, `web`, `web_editor`). Therefore inherited ACLs from `base`/`mail`/`web_editor` already apply, and no additional `security/ir.model.access.csv` is required.

- **`res.company` (global per-company settings, 7 fields added via `_inherit`):**
  - `theme_brand_color: Char` (validated by `@api.constrains` hex-format regex at `models/res_company.py` L84-L94; accepts `#RGB` or `#RRGGBB` case-insensitive; empty/None explicitly allowed for unset state)
  - `background_image: Binary` (Home Menu wallpaper, stored as attachment)
  - `theme_font_family: Selection` (one of 5 font-family stacks: inter/jakarta/roboto/outfit/system)
  - `theme_color_palette: Selection` (one of 8 named palettes sapphire/violet/emerald/amber/crimson/teal/slate/rose + "custom")
  - `theme_ui_density: Selection` (Compact/Standard/Comfortable)
  - `theme_font_size: Selection` (Compact/Standard/Comfortable base pixel scales)
  - `favicon: Binary` (browser-tab favicon binary blob, stored as attachment)
- **`res.users` (personal per-user settings, 3 fields added via `_inherit`):**
  - `chatter_position: Selection` (`Side` / `Bottom`)
  - `dialog_size: Selection` (`Minimize` / `Maximize`)
  - `sidebar_type: Selection` (mobile drawer variants: invisible/small/large)
  - All three fields are explicitly listed in `SELF_WRITEABLE_FIELDS` + `SELF_READABLE_FIELDS` properties on the overridden `res.users` model (at `models/res_users.py` L12-L25) so non-admin users can edit their own preferences without requiring admin permission. Corresponding XML field added to `views/res_users.xml` in the Preferences tab.
- **`ir.config_parameter` keys read by the session_info flow:**
  - `ansis_web_theme.disable_quick_create` (new / recommended; boolean string: "1"/"True" disables the Many2One Quick-Create widget globally)
  - `muk_web_utils.disable_quick_create` (legacy Muk fallback, only exists for migrated installs; read if the ANSIS key is absent — ANSIS wins if both are set)

---

## 5.5 Sudo Rationale (`.cursorrules` compliance)

Three `.sudo()` escalations are present in the module. Per `.cursorrules` every single `sudo()` MUST have a preceding line comment explaining the privilege-escalation rationale. All three calls below have been updated to carry their compliance comments in 18.0.1.1.0.

1. **`models/ir_binary.py` line 17:** `return record.sudo()` (wrapped in an if-block guard at L12)
   **Rationale:** Unauthenticated / public users need read access to company branding assets (favicon, logo, login page wallpaper, menu wallpaper) for the anonymous-login page and public web routes, which would otherwise be blocked by `res.company` record rules on unauthenticated requests. This read-only scope is tightly bounded to the branding-binary controller endpoint that explicitly returns only these fields via the `_find_record_check_access` override.

2. **`models/ir_http.py` line 20:** `self.env["ir.config_parameter"].sudo().get_param`
   **Rationale:** Internal non-admin users must read two system-parameter keys (`disable_quick_create`, legacy Muk fallback) for JS-layer feature toggles. Non-admin users normally cannot read `ir.config_parameter` rows; we use a single-query elevated read to return the boolean answer. Never used for writes.

3. **`models/ir_http.py` line 36:** `self.env.user.company_ids.sudo().with_context(bin_size=True)`
   **Rationale:** A user needs branding/theme metadata for ALL companies in their switchable set, not just those where they have full record-rule visibility of `res.company` branding blobs. `with_context(bin_size=True)` is used to AVOID streaming binary blob bytes back to the ORM layer — we only need the truthiness of "is a favicon uploaded?" + the scalar string fields (font / palette / density / scale / sidebar type / brand color hex). Using `sudo()` here keeps the query footprint minimal and avoids spurious AccessErrors on multi-company installs.

---

## 5.6 Test Runner Recipes

Copy-paste commands for the `LOCAL_ODOO18` container against the `SEQ8` database. All commands use `docker exec` from the macOS host.

- **A) Smoke — method + button existence check:**
  ```bash
  docker exec LOCAL_ODOO18 odoo-bin shell -d SEQ8 --no-http <<'EOF'
  m = env['res.config.settings']
  assert hasattr(m, '_reset_theme_color_assets'), "Method missing — Issue #1 regression"
  assert hasattr(m, 'action_reset_theme_color_assets'), "Settings button missing"
  result = m.action_reset_theme_color_assets()
  assert result == {'type': 'ir.actions.client', 'tag': 'reload'}
  print("A) Smoke ok")
  EOF
  ```
  Expected exit: 0, stdout contains `A) Smoke ok`.

- **B) Uninstall end-to-end (Issue #1 original reproducer):**
  ```bash
  docker exec LOCAL_ODOO18 odoo-bin shell -d SEQ8 --no-http <<'EOF'
  from ansis_web_theme import _uninstall_cleanup
  _uninstall_cleanup(env)  # must NOT raise AttributeError
  print("B) Uninstall cleanup ok")
  EOF
  ```

- **C) Full tagged module tests:**
  ```bash
  docker exec LOCAL_ODOO18 odoo-bin -d SEQ8 -i ansis_web_theme --test-enable --stop-after-init --tags=ansis_web_theme
  ```

- **D) 4-save ORM palette round-trip (Issue #2 original reproducer + regression guard):**
  ```bash
  docker exec LOCAL_ODOO18 odoo-bin shell -d SEQ8 --no-http <<'EOF'
  import base64
  settings = env['res.config.settings'].create({})
  # 4 saves back-to-back: Sapphire → Violet → Emerald → Amber
  ordered = [("sapphire", "#0284c7"), ("violet", "#7c3aed"), ("emerald", "#059669"), ("amber", "#ea580c")]
  for palette, hex_ in ordered:
      env.company.write({"theme_color_palette": palette, "theme_brand_color": hex_})
      settings.set_values()  # triggers _save_color_asset for the current company theme
  env.cr.commit()
  # Now READ the overridden colors.scss attachment and confirm prefix + latest hex
  custom_url = env['web_editor.assets']._make_custom_asset_url(
      "/ansis_web_theme/static/src/scss/colors.scss",
      "web._assets_primary_variables"
  )
  att = env['ir.attachment'].search([('url', '=', custom_url)], order='id desc', limit=1)
  scss = att.datas.decode('base64')
  assert "$mk_color_brand: #ea580c;" in scss, f"prefix or last amber value missing, got {scss[:300]}"
  assert "#7c3aed" not in scss, "Old violet value is still in SCSS after save #3/#4 — round-trip broken"
  print("D) 4-save palette round-trip ok")
  EOF
  ```

- **E) Hex constrain firing (Issue #7 reproducer + regression guard):**
  ```bash
  docker exec LOCAL_ODOO18 odoo-bin shell -d SEQ8 --no-http <<'EOF'
  from odoo.exceptions import ValidationError
  main = env.company
  try:
      main.write({"theme_brand_color": "invalid-color"})
  except ValidationError:
      pass
  else:
      raise AssertionError("ValidationError not raised for bad hex")
  # Good values pass
  main.write({"theme_brand_color": "#aB3"})
  main.write({"theme_brand_color": "#1a2b3c"})
  main.write({"theme_brand_color": False})
  print("E) Hex constrain firing ok")
  EOF
  ```

- **F) Browser UI 4-save round-trip (manual end-to-end):**
  1. Load the web client as admin.
  2. Settings → Theme & Branding → 4 saves in order: Sapphire → Violet → Emerald → Custom Amber `#ea580c`.
  3. After each save + reload, open DevTools → Elements → select `<html>` → Computed → filter for `--ansis-primary`.
  4. Expected values after each save: `rgb(2, 132, 199)` → `rgb(124, 58, 237)` → `rgb(5, 150, 105)` → `rgb(234, 88, 12)`.

All six recipes are preserved verbatim as a durable Hindsight doc tagged `kind:runbook` in the `coding-agent` bank at `https://hindsight.ansis.com.sg` for future recall by the coding agent.

---

## 5.6 JavaScript & OWL Navigation Architecture (18.0.1.2.0)

### Odoo 18 Dropdown Portal & Teleportation Model

In Odoo 18, all dropdowns and popover panels are rendered via `usePopover(DropdownPopover, ...)` inside `.o-overlay-container` directly appended to `document.body` (outside `.o_main_navbar`).

```
body
├── .o_web_client
│   └── .o_main_navbar
│       └── .o_menu_sections (Trigger buttons only)
└── .o-overlay-container (PORTAL ROOT)
    ├── .o-overlay-item -> DropdownPopover (Level 1)
    └── .o-overlay-item -> DropdownPopover (Level 2+ Submenu)
```

**Architectural Rules:**
1. **Never manipulate dropdown DOM directly**: Calling `innerHTML = ""` or querying `.o_main_navbar .o_menu_sections .dropdown-menu` destroys Owl's virtual DOM nodes, breaks `useDropdownNesting` internal states, and detaches action dispatch listeners.
2. **QWeb Recursive Nesting**: Submenu cascading is achieved purely through QWeb template inheritance on `web.NavBar.SectionsMenu.Dropdown.MenuSlot` and `web.NavBar.SectionsMenu.MoreDropdown`. When an item has `childrenTree.length > 0`, it renders a child `<Dropdown menuClass="'ansis_sf_dropdown_menu'">` containing a recursive `<t t-call="web.NavBar.SectionsMenu.Dropdown.MenuSlot">`.
3. **Automatic Right-Start Positioning**: Odoo 18's `<Dropdown>` natively integrates `useDropdownNesting()`. When an open dropdown component detects a parent dropdown context (`this.hasParent === true`), it automatically:
   - Sets popover position to `right-start` (cascading flyout to the right).
   - Adds `.o-dropdown--has-parent` class to the trigger button.
   - Binds `mouseenter` to open the flyout and `dropdownControl.closeChildren()` on sibling leaf hover.
   - Handles `ArrowRight` (open), `ArrowLeft` (close), and `Escape`.

### Reactive Active Menu State (`NavBar.js`)

| Method / Hook | File | Purpose |
|---|---|---|
| `isMenuActive(menu)` | `navbar.js` | Evaluates reactively in QWeb templates. Traces `this.state.currentActiveMenuId` up ancestor links via `menuService.getMenu(parentId)`. Returns `true` for the active leaf item, intermediate flyout triggers, AND the top-level navbar section button. |
| `_syncActiveMenu()` | `navbar.js` | Synchronizes active menu ID on `ACTION_MANAGER:UI-UPDATED`, `onMounted`, and direct URL hash changes (`#menu_id=...`). |
| `onNavBarDropdownItemSelection(menu)` | `navbar.js` | Updates `this.state.currentActiveMenuId = menu.id` upon menu click. |

