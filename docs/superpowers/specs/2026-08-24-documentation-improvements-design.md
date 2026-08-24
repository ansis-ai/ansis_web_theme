# Documentation Improvements — Design Spec
- **Project:** `ansis_web_theme` (Odoo 18 addon, repo path `/Users/wsloh/perfectwork/PW_ADDONS.18.0/ansis/ansis_web_theme`)
- **Date:** 2026-08-24
- **Author:** Wilson Loh / ANSIS Pte Ltd
- **Target version:** `ansis_web_theme 18.0.1.1.0` and later

---

## 0. SCOPE & AUDIENCES

**Approved architecture: Approach 1 (Layered Hybrid, 4 documents total).** Decisions locked from brainstorming:

| Decision | Value |
|---|---|
| Primary Audience | **C) Both audiences** — end-users & admins first, developer appendix second |
| Doc format | **Quick-start + deep hybrid** — short marketing overview at root; separate deep RST/MD files for detail |
| Feature priority | **E) Kitchen sink (full scope)** — user personalization (A) + brand palette usage (B) + dev reference (C) + multi-company / hardening (D) |

Audience rule: every document targets ONE primary audience. End-user procedural steps and technical SCSS variable tables MUST live in different sections or documents — never intermix.

---

## 1. TARGET DOCUMENTS

| # | File | Action | Primary Audience | Job to be done |
|---|------|--------|----------|---------|
| 1 | `README.md` (repo root) | Edit in place | Both (shared marketing splash) | Polished quick-start splash page. Fix stale version badge. Add "What's New" banner. Tighten ✨ Key Features. Keep short. |
| 2 | `readme/USAGE.rst` | Expand existing (15 lines → ~120 lines) | End users / admins | Step-by-step UI walkthrough. Keyboard shortcuts table. Personal preference walkthrough. Mobile vs desktop behavior. |
| 3 | `readme/CONFIGURE.rst` | Expand existing (7 lines → ~100 lines) | Admins + technical devs | Theme & Branding tab deep dive. Brand palette architecture. Hex rules. Reset button. Multi-company defaults. Uninstall guarantees. |
| 4 | `docs/DEVELOPER_APPENDIX.md` | NEW file | Developers only | Python public API table. Session-info reference. SCSS variable naming. Asset bundles. Model field maps. Sudo rationale. Test-runner recipes. |

Convention note: `readme/*.rst` stay RST (required by Odoo Apps Store which renders them on the module's listing page). The developer appendix is a standalone Markdown file because it is for internal maintainers, not public marketing.

---

## 2. DOCUMENT #1 — README.md (root, edit in place)

### 2.1 Badges (L7-L10)
- L9 version badge: update SVG color suffix from `Version-18.0.1.0.0-0284c7` → **`Version-18.0.1.1.0-0284c7`** (matches `__manifest__.py` version bump after 14-defect batch).

### 2.2 NEW section: "🆕 What's New in 18.0.1.1.0"
- **Placement:** Insert right after the badges-divider `---` (currently L13), before the Overview paragraph at L16.
- **Purpose:** Returning users of 18.0.1.0.0 learn the headline fixes at a glance.
- **Body (3 bullets + a trailing summary):**
  1. ✅ **Uninstall crash fixed.** `_reset_theme_color_assets` now correctly available on `res.config.settings` so module removal no longer raises `AttributeError`.
  2. ✅ **Palette round-trip fixed.** Brand colors persist across save #2, #3, and #4. Previously, 2nd+ save silently discarded the user's new color.
  3. ✅ **Multi-company defaults on install.** ANSIS wallpaper + favicon now auto-applied to EVERY company on first install (not just `base.main_company`), including archived companies.
  - Also shipped: sudo() compliance comments, hex-color `@api.constrains` validation, `sidebar_type` exposed in user preferences, plus 4 other fixes.

### 2.3 ✨ Key Features (L24-L64)
Keep existing 6-section structure, add 2 new feature sections + sub-bullets:

- **§5 Dedicated Application Settings** (existing ~L51): append these sub-bullets:
  - Chatter position per user: `side` split-screen OR `bottom` under form. Includes horizontal drag-to-resize splitter.
  - Dialog size default per user: `minimize` OR `maximize`. Maximize / restore toggle button in every dialog header.
  - Sidebar type selector for mobile drawer variants, now exposed in the User Preferences form.
  - Quick-Create on/off global override: `ansis_web_theme.disable_quick_create` system parameter.
- **§6 Mobile Sidebar** (existing): append "sidebar_type preference is user-selectable via User Preferences."
- **§7 — NEW — Chatter & Dialog UX:**
  - Draggable + resizable dialog windows. Maximize / restore header toggle with fullscreen mode.
  - Horizontal side-chatter layout (position = `side`) with draggable splitter; double-click the splitter to reset width.
  - Eye-icon notification filter in chatter to hide automated notification messages on demand.
- **§8 — NEW — Field Widget Enhancements:**
  - Binary field inline previews: PDF viewer, image lightbox, video player, code/text inspector.
  - `list.image` compact 30px thumbnail widget for list views.
  - `selection_icons` widget renders FontAwesome glyphs instead of raw text selection values.
  - `text_icon` widget: icon + tooltip popovers for dense char/text/html list columns.
  - X2Many `no_open` patch: supports `options="{'no_open': True}"` to block drilling into related records.

### 2.4 Installation (L67-L81)
- L80 command: change `odoo -u ansis_web_theme -d <db>` → two lines:
  - Fresh install: `odoo-bin -i ansis_web_theme -d <database_name> --stop-after-init`
  - Upgrade existing: `odoo-bin -u ansis_web_theme -d <database_name> --stop-after-init`
- Add a short explainer: `-i installs the module; -u updates an existing installation.`
- Add compatibility note: module explicitly excludes `web_enterprise` (see `__manifest__.py` L28-30). Works only on Odoo Community 18.0.
- Add post-install note: on first install, the registered `post_init_hook=_setup_module` auto-configures every company's Home Menu wallpaper + browser-tab favicon binary default (empty-field-only semantics, so user customizations are preserved on upgrades).

### 2.5 Architecture & OCA Compliance table (L100-L108)
Append two new rows:

| Standard | Implementation |
|---|---|
| **Post-init & uninstall hooks** | `_setup_module` (applies company defaults) and `_uninstall_cleanup` (deletes overridden SCSS assets) registered in `__manifest__.py` L85-L86. |
| **Hindsight memory retention** | Durable initiative + 4 detailed knowledge docs retained in Hindsight bank `coding-agent` at `https://hindsight.ansis.com.sg`. |

---

## 3. DOCUMENT #2 — readme/USAGE.rst (expand 15 → ~120 lines)

### 3.1 §1 — Home Menu & Dashboard Navigation
- Screenshot placeholder: `(screenshot: static/description/usage_home_menu.png)` — home menu overlay with search + drag-drop grid.
- Keyboard shortcuts table:

| Shortcut | Action |
|---|---|
| Hover top-left brand icon / `<` chevron | Return to Home Menu overlay |
| Type any alphanumeric key | Immediate real-time app-search filter |
| Arrow keys ← ↑ ↓ → | Navigate the app grid |
| Home / End | Jump to first / last app card |
| Enter | Launch the currently-highlighted app |
| Esc | Clear search or close the overlay |
| Drag & drop app cards | Reorder your dashboard. Persisted via `localStorage` + `res.users.settings`. |

### 3.2 §2 — List & Data Views
- Sticky `<thead>` (always visible during vertical scroll)
- Frozen-left selection checkbox column during horizontal scroll
- Sticky `<tfoot>` aggregates / totals pinned to the bottom
- Optional Columns cog (rightmost header) + interactive drag column resizer

### 3.3 §3 — Form Views & Mobile UX
- Underline-style Notebook tabs with sapphire accent.
- Elevated stat-button box (metric cards with accent icon tiles).
- Mobile statusbar pipeline (pill-style stage chevrons, consistent 34px action buttons).

### 3.4 §4 — User Preferences Feature Guide (NEW)
- **Chatter Position:**
  - Choices: `Side` (right-split screen next to the form) or `Bottom` (classic under-form panel).
  - Side: drag divider horizontally to resize chatter pane. Double-click the divider to reset default width.
  - Eye-icon toggle inside chatter: hide automated notification messages so only human chatter/comments/tracked-changes show.
- **Dialog Size Default:**
  - `Minimize` — default compact modal. `Maximize` — fullscreen by default.
  - Every dialog has a maximize/restore toggle in the header next to close. Dialogs are draggable (grab the title bar) and manually resizable (grab bottom-right corner).
- **Sidebar Type:**
  - Mobile-only: variant controls for the offcanvas burger drawer that opens below 768px width.
  - Includes 1-tap "All Apps / Dashboard" primary button and 44px touch targets for nested menus.

### 3.5 §5 — 6-step Walkthrough: Changing Your Personal Theme Preferences
1. Top-right user avatar menu → My Profile.
2. Open the Preferences tab.
3. Set Chatter Position = Side or Bottom.
4. Set Dialog Size = Minimize or Maximize.
5. Set Sidebar Type matching your mobile preference.
6. Click **Save**. Preference takes effect on next page reload.

---

## 4. DOCUMENT #3 — readme/CONFIGURE.rst (expand 7 → ~100 lines)

### 4.1 §1 — Open the Theme & Branding Settings
- Screenshot placeholder: `(screenshot: static/description/configure_theme_tab.png)` — left navigation Theme & Branding section.
- Only users with admin / configuration access can modify company-global theme settings.

### 4.2 §2 — Typography & Layout Density
- **Font Family selector (5 stacks):** Inter (Modern SaaS default), Plus Jakarta Sans (Geometric), Roboto (Neutral Enterprise), Outfit (Round), Apple System / SF Pro Default (Native OS).
- **Base Font Scale:** Compact 13px / Standard 14px / Comfortable 15px.
- **UI Layout Density (3 presets with row-height guarantees):**
  - Compact: 32px list rows — high-density workflows.
  - Standard: 40px rows — modern SaaS default.
  - Comfortable: 48px rows — spacious enterprise layout.
- CSS var mapping: `--ansis-font-sans` and `--ansis-font-size-base` get injected on save.

### 4.3 §3 — Brand Palette & Colors (core section)
- **5 preset palettes + Custom Hex:**
  - Sapphire Blue `#0284c7` (default)
  - Royal Violet `#7c3aed`
  - Emerald Green `#059669`
  - Berry Rose
  - Sunset Amber `#ea580c`
  - Custom Hex Color (manual color-picker or hex input)
- **Exactly what changes when you pick a primary brand color:**
  - `--ansis-primary` = base chosen hex
  - `--ansis-primary-light` = tinted 10% with white pastel (for surfaces, soft badges)
  - `--ansis-primary-hover` = darkened 8% shade (button hover)
  - `--ansis-primary-focus` = 14% alpha focus-ring outline (accessibility)
  - Downstream UI elements affected: notebook tab underline, stat-button accent borders, Save/Create button colors, input focus glow, links, selection colors.
- **Hex format rules (strict @api.constrains):** Accepts `#RGB` (3-digit shorthand like `#abc`) or `#RRGGBB` (6-digit full like `#a1b2c3`). Case insensitive. Any other string raises `ValidationError` with a friendly message. Empty / None is allowed (unset state). See `res_company.py` L84-L94.
- **Palette Round-Trip 4-save test (Issue #2 historical regression note):** In 18.0.1.0.0, 2nd+ palette save was silently a no-op because the SCSS replacement stripped the `$mk_` prefix. This is FIXED in 18.0.1.1.0. Troubleshooting step: if an old override still has the broken unprefixed form, ONE palette save re-heals it automatically (the read-regex tolerates unprefixed values).
- **Reset Custom Theme Assets button:**
  - Calls `_reset_theme_color_assets()` BEFORE triggering the client reload.
  - Deletes customized `ir.attachment` + `ir.asset` overrides for all 3 color SCSS files in both the `web._assets_primary_variables` bundle and `web.assets_web_dark` bundle.
  - After reload, all palette customizations return to module defaults.

### 4.4 §4 — Company Wallpaper & Assets
- Upload a custom Home Menu **background wallpaper** (stored on `res.company.background_image`).
- Upload a custom **browser-tab favicon**.
- Multi-company on first install: the post-init hook applies defaults to ALL companies (including archived) using an empty-field-only guard so pre-existing custom imagery is NEVER overwritten on upgrade or re-install.

### 4.5 §5 — Advanced: Global Quick-Create Override
- System parameter `ansis_web_theme.disable_quick_create` (boolean string, default empty = disabled).
- Legacy Muk fallback `muk_web_utils.disable_quick_create` is also read, for migrated installs.
- Serialized into `session_info.disable_quick_create` for JS-layer widget-wide behavior.

### 4.6 §6 — Uninstall Guarantees
- Registered uninstall hook `_uninstall_cleanup(env)` (see `__init__.py` L16-L23) runs whenever the module is removed.
- Behavior: calls `env['res.config.settings']._reset_theme_color_assets()` on uninstall. Deletes every overridden SCSS attachment and custom `ir.asset` row. No orphaned customization rows left in the database after uninstall.

---

## 5. DOCUMENT #4 — docs/DEVELOPER_APPENDIX.md (NEW, ~250 lines)

### 5.1 Python Public Method Reference (12 methods)

| Method | File + Line Range | Parameters | Returns | Purpose |
|---|---|---|---|---|
| `_get_color_variable` | `web_editor_assets.py` L38-L46 | `scss_contents: str`, `variable_name: str` | `str \| None` | Extracts current value of a SCSS variable via healing regex. Tolerates `$mk_` / `$ansis_` / NO prefix (heals old overrides). |
| `_replace_color_variables` | `web_editor_assets.py` L48-L57 | `scss_contents: str`, `variables: list[dict]` each with `name` and `value` | `str` | Replaces every listed variable; ALWAYS writes the canonical `$mk_` prefix into output. |
| `_get_colors_attachment` | `web_editor_assets.py` L18-L20 | `custom_url: str` | `ir.attachment` recordset (possibly empty) | Exact-match lookup by `path = custom_url`. Symmetric with `_get_colors_asset`. |
| `_get_colors_asset` | `web_editor_assets.py` L22-L25 | `custom_url: str` | `ir.asset` recordset | Same exact `=` match (Issue #3: previously used `like`, which could mutate unrelated assets). |
| `_make_custom_asset_url` | `web_editor_assets.py` L27-L35 | `url: str`, `bundle: str` | `str` | Builds the suffixed custom URL used for override lookups. |
| `_save_color_asset` | `web_editor_assets.py` L37-L80 | `url: str`, `bundle: str`, `scss_content: str` | `None` | Idempotently saves a customized SCSS override as `ir.attachment` + a matching `ir.asset` row. |
| `get_color_variables_values` | `res_config_settings.py` L33-L49 | `self` (res.config.settings record) | `dict[str, dict[str, str]]` with keys `light` and `dark` | Reads current 8-primary SCSS values from both light and dark bundles for rendering the Settings color form. |
| `_onchange_theme_color_palette` | `res_config_settings.py` L51-L55 | trigger: `theme_color_palette` changed | `{'value': {'theme_brand_color': …}}` onchange dict | Lookup the chosen palette in the `PALETTES` SSOT dict and auto-populate the hex color field. |
| `action_reset_theme_color_assets` | `res_config_settings.py` L57-L62 | `self` | `{'type': 'ir.actions.client', 'tag': 'reload'}` | UI button handler. Calls the reset method first, THEN triggers client reload. |
| `_reset_theme_color_assets` | `res_config_settings.py` L64-L79 | `self` (model-level, env-only OK) | `None` | Loops 3 SCSS files × 2 bundles, deletes matching customized attachments and ir.asset overrides. Used by uninstall hook + reset button. |
| `_setup_module` | `__init__.py` L12-L26 | `env` | `None` | `post_init_hook`. Applies wallpaper + favicon binary defaults across ALL companies (active_test=False) using only-if-empty semantics. |
| `_uninstall_cleanup` | `__init__.py` L16-L23 | `env` | `None` | `uninstall_hook`. Deletes all overridden SCSS customizations from the DB via `env['res.config.settings']._reset_theme_color_assets()`. |

### 5.2 Session-Info Reference (serialized for JS hooks)

| Key | Type | Where set | Purpose |
|---|---|---|---|
| `session_info.chatter_position` | `'side' \| 'bottom'` | `ir_http.py` session_info override | OWL chatter renderer decides split-screen vs under-form. |
| `session_info.dialog_size` | `'minimize' \| 'maximize'` | `ir_http.py` | Default size state applied to every new `Dialog` + `SelectCreateDialog`. |
| `session_info.disable_quick_create` | `bool` | `ir_http.py` — reads `ansis_web_theme.disable_quick_create`, falls back to legacy Muk param | Global Many2One Quick-Create widget override. |
| `session_info.user_companies.allowed_companies[id].branding_extended` | `dict[favicon_set:bool, theme_font, theme_color_palette, theme_brand_color, theme_ui_density, theme_font_scale, sidebar_type]` | `ir_http.py` L25-L52, iterates `company_ids.sudo().with_context(bin_size=True)` | Provides branding tokens for every switchable company so the JS theme service doesn't re-read on every company switch. |

### 5.3 SCSS Variable Naming & Asset Bundles
- **SCSS primary variable conventions:**
  - Canonical written form: `$mk_color_<name>` (8 primaries: `brand`, `primary`, `secondary`, `success`, `info`, `warning`, `danger`, `alpha`).
  - Fallback read form (SCSS source + healing regex): `$color_<name>` unprefixed.
  - Reserved future alias: `$ansis_color_<name>` (fork rename, dead today, regex covers it to auto-migrate on future enable).
- **3 core SCSS files that are customized and overridden at runtime:**
  1. `static/src/scss/colors.scss` — light palette primaries
  2. `static/src/scss/colors_dark.scss` — dark-mode palette overrides
  3. `static/src/scss/variables.scss` — font family + density / scale variables
- **2 asset bundles involved in customization override:**

| Bundle | Declaration order in `__manifest__.py` |
|---|---|
| `web._assets_primary_variables` | `prepend` colors.scss → `after web/static/src/scss/primary_variables.scss` → variables.scss |
| `web.assets_web_dark` | `after colors.scss` → colors_dark.scss |
| `web.assets_backend` | Bulk `**/*.scss` + `**/*.xml` + `**/*.js` for all widgets, chatter patcher, form compiler patcher |

### 5.4 Model Field Maps we Extend
- **`res.company` (global company settings):** `theme_brand_color`, `background_image`, `theme_font`, `theme_color_palette`, `theme_ui_density`, `theme_font_scale`, `favicon`.
- **`res.users` (personal per-user settings):** `chatter_position`, `dialog_size`, `sidebar_type`. All three are in `SELF_WRITEABLE_FIELDS` + `SELF_READABLE_FIELDS` so non-admin users can edit their own preferences.
- **`ir.config_parameter` keys read by session_info:** `ansis_web_theme.disable_quick_create` (legacy fallback: `muk_web_utils.disable_quick_create`).

### 5.5 Sudo Rationale (cursorrules compliance)
Three `sudo()` escalations in the module, each with required inline comments:
1. `ir_binary.py` L14: unauthenticated / public users need read access to company branding assets (favicon, logo, login / menu wallpaper) for the anonymous-login page and public web routes, which would otherwise be blocked by `res.company` record rules.
2. `ir_http.py` L16: `ir.config_parameter.sudo()` — internal non-admin users must read two system-parameter keys (`disable_quick_create`, legacy Muk fallback) for JS-layer feature toggles. Non-admin users normally cannot read `ir.config_parameter` rows, so brief elevated read.
3. `ir_http.py` L25: `company_ids.sudo().with_context(bin_size=True)` — user needs branding/theme metadata for ALL companies in the switchable set, not just those with full record-rule visibility of `res.company` branding blobs. `bin_size=True` avoids streaming binary blob bytes (we only need boolean "has favicon?" truthiness + scalar string fields, not the actual bytes).

### 5.6 Test Runner Recipes
Copy-paste commands for `LOCAL_ODOO18` container + `SEQ8` DB:
- **A) Smoke:** method + button existence check.
- **B) Uninstall end-to-end:** `_uninstall_cleanup(env)` no exception.
- **C) Full tagged module tests:** `odoo-bin -d SEQ8 -i ansis_web_theme --test-enable --stop-after-init --tags=ansis_web_theme`
- **D) 4-save ORM palette round-trip test:** 3 consecutive palette writes round-trip hex + preserve `$mk_` prefix.
- **E) Hex constrain firing:** bad string raises `ValidationError`; good `#RGB`/`#RRGGBB` pass; empty is allowed.
- **F) Browser UI 4-save round-trip:** DevTools `--ansis-primary` computed value after each save.

All recipes are preserved verbatim as a durable Hindsight doc tagged `kind:runbook`.

---

## 6. DELIVERABLE SIZE ESTIMATE

| Target | Approx new lines | Approx changed lines | New file? |
|---|---|---|---|
| 1. `README.md` | ~40 | ~20 (badge + installation + architecture) | No |
| 2. `readme/USAGE.rst` | ~105 | 15 original → keep + integrate into new structure | No |
| 3. `readme/CONFIGURE.rst` | ~93 | 7 original → integrate | No |
| 4. `docs/DEVELOPER_APPENDIX.md` | ~250 | n/a | **Yes** |
| **Total** | **~488 new lines** | | **1 new file** |

---

## 7. OUT OF SCOPE (YAGNI — explicitly excluded this pass)
- Sphinx build setup / `doc/conf.py` / `make html` — overkill for a single module; keep flat RST + MD.
- Actual PNG screenshot files. Write screenshot placeholder references only; imagery added in a follow-up when screenshots are captured from a live instance.
- Full changelog rewrite / `doc/changelog.rst` update for 18.0.1.1.0 — handled in a separate changelog pass if requested.
- FAQ / Troubleshooting section — added only when a pattern of support questions appears.
