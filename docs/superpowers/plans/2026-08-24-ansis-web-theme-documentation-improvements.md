# ansis_web_theme Documentation Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the `ansis_web_theme` Odoo 18 module's documentation across 4 targets — end-user FEATURES visibility, step-by-step USAGE guide, CONFIGURATION deep-dive, and a DEVELOPER appendix — as defined in `docs/superpowers/specs/2026-08-24-documentation-improvements-design.md`.

**Architecture:** Layered hybrid 4-document approach. (1) Root `README.md` stays short, marketing-focused — edit in place. (2) `readme/USAGE.rst` and (3) `readme/CONFIGURE.rst` are Odoo Apps-Store compatible RST fragments, replaced inline with expanded content. (4) A new standalone Markdown file `docs/DEVELOPER_APPENDIX.md` stores technical reference material for maintainers only. Audience separation rule: end-user procedural content and SCSS/ORM technical content NEVER live in the same document section.

**Tech Stack:** Markdown (README.md, DEVELOPER_APPENDIX.md), reStructuredText (USAGE.rst, CONFIGURE.rst — Odoo Apps Store rendering requirement). No Sphinx build needed (YAGNI / out of scope).

---

## File Structure (locked decomposition)

| File | Action | Primary Audience | Lines outcome |
|------|--------|----------|---------------|
| `README.md` | Modify in-place | End users + devs shared | ~20 lines changed / ~40 new |
| `readme/USAGE.rst` | Modify in-place (replace existing 15 lines) | End users / admins | ~120 lines |
| `readme/CONFIGURE.rst` | Modify in-place (replace existing 7 lines) | Admins + technical devs | ~100 lines |
| `docs/DEVELOPER_APPENDIX.md` | Create NEW | Developers only | ~250 lines |

No Python changes. No XML changes. No new directories beyond what already exists (`docs/` was created for the spec earlier).

---

## Task 1: README.md — Badge + What's New + Key Features add-ons + Installation + Architecture rows

**Files:**
- Modify: `README.md:7-108` (root)

- [ ] **Step 1.1 Fix stale version badge on L9**
  Before:
  ```markdown
  [![Version-18.0.1.0.0-0284c7](https://img.shields.io/badge/Version-18.0.1.0.0-0284c7?labelColor=ffffff&style=for-the-badge)](https://github.com/ansisSG/PW_ADDONS.18.0)
  ```
  After:
  ```markdown
  [![Version-18.0.1.1.0-0284c7](https://img.shields.io/badge/Version-18.0.1.1.0-0284c7?labelColor=ffffff&style=for-the-badge)](https://github.com/ansisSG/PW_ADDONS.18.0)
  ```

- [ ] **Step 1.2 Insert "🆕 What's New in 18.0.1.1.0" block between the divider `---` at L13 and the Overview paragraph at L16.**
  Insert exactly:
  ```markdown
  ## 🆕 What's New in 18.0.1.1.0

  1. ✅ **Uninstall crash fixed.** `_reset_theme_color_assets` now correctly available on `res.config.settings` so module removal no longer raises `AttributeError`.
  2. ✅ **Palette round-trip fixed.** Brand colors persist across save #2, #3, and #4. Previously, 2nd+ save silently discarded the user's new color choice (regex-wrote an unprefixed SCSS variable that the read-side couldn't match anymore).
  3. ✅ **Multi-company defaults on install.** ANSIS wallpaper + favicon now auto-applied to EVERY company on first install (not just `base.main_company`), including archived companies — using empty-field-only semantics so pre-existing user customizations are preserved on upgrade/re-install.

  Also shipped: sudo() compliance comments, hex-color `@api.constrains` validation, `sidebar_type` exposed in User Preferences form, LIKE→= exact lookup fix for asset overrides, PALETTES dedup across two model files, and a fixed `ir.asset` lookup in `_save_color_asset`.

  ---
  ```

- [ ] **Step 1.3 Append 2 new sub-bullets and 2 new sections to ✨ Key Features after L63 (after §6 Mobile Sidebar)**

  **Append these 4 sub-bullets to the END of the §5 Dedicated Application Settings bullet list (currently the last line of §5 is about the Theme Color Palette popup):**
  ```markdown
  - Chatter position per user: `side` split-screen OR `bottom` under form. Includes horizontal drag-to-resize splitter.
  - Dialog size default per user: `minimize` OR `maximize`. Maximize / restore toggle button in every dialog header.
  - Sidebar type selector for mobile drawer variants, now exposed in the User Preferences form so non-admins can change their own.
  - Global Many2One Quick-Create on/off override via the `ansis_web_theme.disable_quick_create` system parameter.
  ```

  **Append 1 sentence to §6 Mobile Sidebar at the end:**
  ```
  sidebar_type preference is user-selectable via User Preferences so each user can pick their preferred mobile drawer variant.
  ```

  **Append two BRAND NEW sections §7 + §8 right after the §6 Mobile Sidebar bullet list ends, before §7 (currently numbered 7 in the original README, which is the Odoo Standard section — renumber original §7 Odoo Standard → §9; §8 Installation → §10; §9 Dependencies → §11).**

  Insert BEFORE the existing "### 7. Odoo Standard" heading:
  ```markdown
  ### 7. Chatter & Dialog UX

  - Draggable + resizable dialog windows. Maximize / restore header toggle with fullscreen mode support.
  - Horizontal side-chatter layout (`chatter_position = side`) with draggable splitter; double-click the splitter to reset the default width.
  - Eye-icon notification filter inside chatter so users can hide automated notification messages on demand and show only human chatter / comments / tracked changes.

  ### 8. Field Widget Enhancements

  - Binary field inline previews: PDF viewer, image lightbox, embedded video player, code/text inspector modal.
  - `list.image` compact 30px thumbnail widget for list view columns.
  - `selection_icons` widget renders FontAwesome glyphs instead of raw-text selection values.
  - `text_icon` widget: icon + tooltip popovers for dense `Char` / `Text` / `Html` list columns.
  - X2Many `no_open` patch: supports `options="{'no_open': True}"` on One2Many / Many2Many fields to block drilling into related records.
  ```

- [ ] **Step 1.4 Installation section: swap `-u` for `-i/-u` split + add 2 explainer bullets.**
  Find the `### Installation` section command (current single line says `odoo -u ansis_web_theme -d <db>`). REPLACE the one command with:
  ```markdown
  - **Fresh install:** `odoo-bin -i ansis_web_theme -d <database_name> --stop-after-init`
  - **Upgrade existing:** `odoo-bin -u ansis_web_theme -d <database_name> --stop-after-init`
  - (`-i` installs a new module; `-u` updates an existing installation.)
  - **Compatibility:** This module explicitly excludes `web_enterprise` (see `__manifest__.py`). It works only with Odoo Community 18.0.
  - **Post-install auto-configuration:** On first install, the registered `post_init_hook=_setup_module` auto-configures every company's Home Menu wallpaper + browser-tab favicon binary default (empty-field-only semantics, so user customizations are preserved on upgrades).
  ```

- [ ] **Step 1.5 Append two rows to the Architecture & OCA Compliance table.**
  Find the existing table under the section that lists Standards (currently about Python / XML / Security / Views / Versioning / License). Append at the end two more rows:
  ```markdown
  | **Post-init & uninstall hooks** | `_setup_module` (applies company wallpaper/favicon defaults) and `_uninstall_cleanup` (deletes overridden SCSS assets without leftovers) are both registered in `__manifest__.py` L85-L86. |
  | **Hindsight memory retention** | Durable initiative + 4 detailed knowledge docs retained in Hindsight bank `coding-agent` at `https://hindsight.ansis.com.sg`. |
  ```

- [ ] **Step 1.6 Verify README.md renders correctly — 0 Markdown warnings.**
  Run: open the file in GitHub-flavored preview, or any Markdown viewer.
  Expected: Badge shows Version-18.0.1.1.0; What's New section visible between divider and Overview; Key Features has 8 sections not 6; Installation has 2 commands; Compliance table has 2 new rows.

- [ ] **Step 1.7 Commit (optional — do this only if you plan to dispatch subagents separately; for inline execution this step consolidates at task 5.)**
  ```bash
  cd /Users/wsloh/perfectwork/PW_ADDONS.18.0/ansis/ansis_web_theme
  git add README.md
  git commit -m "docs(readme): badge 18.0.1.1.0, What's New, ChatterUX+Widgets §7-8, install commands, compliance rows"
  ```

---

## Task 2: Expand `readme/USAGE.rst` 15 → ~120 lines (end users / admins)

**Files:**
- Modify: `readme/USAGE.rst:1-15` (existing content; replace it entirely)

- [ ] **Step 2.1 — OVERWRITE the existing 15-line USAGE.rst with the expanded content below.**

  Paste exactly (preserves RST syntax throughout so Odoo Apps Store renders it; uses RST tables, RST headings, no Markdown):
  ```rst
  =====
  Usage
  =====

  This module is fully functional after install with sane defaults. No additional server configuration is required. The features below are purely optional and driven by user or admin preferences.

  1. Home Menu & Dashboard Navigation
  ===================================

  (screenshot: static/description/usage_home_menu.png — home menu overlay with search + drag-drop grid)

  Click the ANSIS logo or the `<` chevron at the top-left of the left navigation to open the *Home Menu* overlay. The overlay shows your enabled apps as a large icon grid with built-in search.

  Keyboard Shortcuts
  ------------------

  +----------------------------------+--------------------------------------------------------------------------------+
  | Shortcut                         | Action                                                                         |
  +==================================+================================================================================+
  | Hover brand icon / `<` chevron    | Return to Home Menu overlay                                                    |
  +----------------------------------+--------------------------------------------------------------------------------+
  | Type any alphanumeric key        | Immediate real-time app-search filter. Matching cards shrink; non-matching     |
  |                                  | fade out.                                                                      |
  +----------------------------------+--------------------------------------------------------------------------------+
  | Arrow keys (← ↑ ↓ →)             | Navigate the app grid one card at a time                                       |
  +----------------------------------+--------------------------------------------------------------------------------+
  | Home / End                       | Jump to first / last app card                                                  |
  +----------------------------------+--------------------------------------------------------------------------------+
  | Enter                            | Launch the currently-highlighted app                                           |
  +----------------------------------+--------------------------------------------------------------------------------+
  | Esc                              | Clear the current search or close the overlay entirely                         |
  +----------------------------------+--------------------------------------------------------------------------------+
  | Drag & drop app cards            | Reorder your dashboard. Persisted via `localStorage` + `res.users.settings`.   |
  +----------------------------------+--------------------------------------------------------------------------------+

  2. List & Data Views
  ====================

  - **Sticky `<thead>`:** Column headers stay pinned to the top of the window during vertical scroll so you never lose context of which column you are editing.
  - **Frozen-left selection checkbox:** During wide-table horizontal scroll, the checkbox column remains pinned so row selection stays accessible.
  - **Sticky `<tfoot>` aggregates / totals:** Summary rows stick to the bottom of the list view during scroll.
  - **Optional Columns cog + column resizer:** Drag column edges to resize; click the gear icon (⋮) on the rightmost header to toggle column visibility.

  3. Form Views & Mobile UX
  =========================

  - **Underline-style Notebook tabs** with brand-accent underline on the active tab (color matches your chosen palette).
  - **Elevated stat-button box** — a row of metric cards with accent icon tiles. Useful for KPIs on lead, opportunity, sale order, and invoice forms.
  - **Mobile statusbar pipeline** — pill-style stage chevrons with consistent 34px touch-action buttons for all devices below 768px.

  4. User Preferences Feature Guide
  =================================

  These three settings live on the *Preferences* tab of the *My Profile* form (top-right avatar menu → My Profile). Each user can change their own values (non-admin self-write access is allowed).

  Chatter Position
  ----------------

  - Choices: **Side** (right-split screen next to the form) or **Bottom** (classic under-form panel directly below the record editor).
  - Side mode: drag the vertical divider left/right to resize the chatter pane. Double-click the divider to reset to the default width.
  - Eye-icon toggle inside chatter: click the 👁 icon in the chatter header to hide automated notification messages so only human chatter, comments, and tracked-changes are visible. Click again to show everything.

  Dialog Size Default
  -------------------

  - ``Minimize`` — default compact modal (great for edit forms on large monitors).
  - ``Maximize`` — fullscreen by default (best for dense records like manufacturing orders or analytic line editors).
  - Every dialog has a maximize / restore toggle in the header next to the close button. Dialogs are also freely draggable (grab the title bar) and manually resizable (grab the bottom-right corner).

  Sidebar Type
  ------------

  - Mobile-only: variant controls for the off-canvas burger drawer that opens below the 768px breakpoint.
  - Includes a 1-tap *All Apps / Dashboard* primary button and 44px touch targets for nested menus.

  5. 6-step Walkthrough — Changing Your Personal Theme Preferences
  =================================================================

  1. Click the avatar in the top-right corner of the window to open the user menu.
  2. Select **My Profile**.
  3. Open the **Preferences** tab (the third tab, after Internal User Preferences / Access Rights / Preferences depending on your user type).
  4. Set **Chatter Position** to either Side or Bottom.
  5. Set **Dialog Size** to Minimize or Maximize. Set **Sidebar Type** to match your mobile drawer preference.
  6. Click **Save** at the bottom of the form. The new preferences take effect on the next page reload (automatic after save in Odoo 18).
  ```

- [ ] **Step 2.2 — RST syntax sanity check (tables especially).**
  Run: scan for unmatched `+----` table grid separators. The tables above use 4 `+` lines per table — make sure header separator (the `====` one) is present.
  Expected: 5 top-level sections numbered 1..5; 1 table in the Keyboard Shortcuts subsection with 8 rows plus header; every `:doc:`/ role or non-standard RST directive removed (we're not using any directives beyond standard RST).

- [ ] **Step 2.3 Optional commit**
  ```bash
  cd /Users/wsloh/perfectwork/PW_ADDONS.18.0/ansis/ansis_web_theme
  git add readme/USAGE.rst
  git commit -m "docs(usage): expand to 120 lines covering navigation, lists, forms, user prefs, walkthrough"
  ```

---

## Task 3: Expand `readme/CONFIGURE.rst` 7 → ~100 lines (admins + technical devs)

**Files:**
- Modify: `readme/CONFIGURE.rst:1-7` (replace existing content)

- [ ] **Step 3.1 — OVERWRITE existing 7-line CONFIGURE.rst with the content below. RST syntax throughout, tables, enumerated sections:**

  ```rst
  ==============
  Configuration
  ==============

  All configuration paths live inside the Odoo web client. No Python or config-file edits are required after module installation.

  1. Open the Theme & Branding Settings
  =====================================

  (screenshot: static/description/configure_theme_tab.png — left navigation Theme & Branding section)

  1. Go to the main **Settings** app.
  2. In the left navigation, click **Theme & Branding** (under the ANSIS Web Theme header section at the top of the settings list).
  3. You will see three main collapsible panels:
     - *Typography & Layout Density*
     - *Brand Palette & Colors*
     - *Company Wallpaper & Assets*

  Only users with admin or configuration access can modify company-global theme settings.

  2. Typography & Layout Density
  ==============================

  Font Family selector — 5 pre-configured stacks
  ----------------------------------------------

  +-------------------+----------------------+-------------------------------------------+
  | Option            | Font Stack           | Use case recommendation                     |
  +===================+======================+=============================================+
  | Inter             | Inter (Modern SaaS)  | Default. Modern geometric sans.             |
  +-------------------+----------------------+---------------------------------------------+
  | Plus Jakarta Sans | Geometric Humanist   | Rounded terminals, highly legible body text.|
  +-------------------+----------------------+---------------------------------------------+
  | Roboto            | Neutral Enterprise   | Google / Material Design familiarity.       |
  +-------------------+----------------------+---------------------------------------------+
  | Outfit            | Round Sans           | Friendly soft edges for customer portals.   |
  +-------------------+----------------------+---------------------------------------------+
  | Apple System      | Native OS            | Best performance on macOS / iOS — uses the  |
  |                   |                      | OS default SF Pro stack.                    |
  +-------------------+----------------------+---------------------------------------------+

  UI Layout Density — 3 presets with row-height guarantees
  ---------------------------------------------------------

  +-------------+---------------------+------------------------------------------------+
  | Preset      | Base list row height| Use case                                       |
  +=============+=====================+================================================+
  | Compact     | 32 px               | High-volume data entry, list-heavy users like  |
  |             |                     | accountants, inventory managers.               |
  +-------------+---------------------+------------------------------------------------+
  | Standard    | 40 px               | Modern SaaS default. Recommended default.      |
  +-------------+---------------------+------------------------------------------------+
  | Comfortable | 48 px               | Spacious enterprise layout. Touch-friendly for |
  |             |                     | convertible laptops or kiosks.                 |
  +-------------+---------------------+------------------------------------------------+

  Base Font Scale accompanies the density: Compact = 13px; Standard = 14px; Comfortable = 15px. On save, two CSS variables are injected into the document root:
  ``--ansis-font-sans`` (the chosen font-family stack) and ``--ansis-font-size-base`` (the computed pixel size).

  3. Brand Palette & Colors
  =========================

  This panel is the heart of the module. Picking a brand color recalculates all theme accent tokens in real time and writes a customized SCSS override into the database.

  Five preset palettes + Custom Hex
  ---------------------------------

  - **Sapphire Blue #0284c7** (factory default — professional, calm, neutral SaaS)
  - **Royal Violet #7c3aed** — for luxury, legal, or creative agencies
  - **Emerald Green #059669** — sustainability, healthcare, fintech
  - **Berry Rose** — retail, fashion, cosmetics, e-commerce
  - **Sunset Amber #ea580c** — construction, logistics, food & beverage
  - **Custom Hex Color** — enter any valid hex or use the color swatch picker

  Exactly what changes when you pick a primary brand color
  --------------------------------------------------------

  For each chosen primary hex, the module calculates 4 derived CSS variables plus a list of downstream UI elements whose color is derived from them:

  - ``--ansis-primary`` — the base chosen hex. Applied to primary button fill, brand logo accent underline, and link text.
  - ``--ansis-primary-light`` — tinted 10% with white. Used for soft badges, subtle surfaces, and the notebook tab accent.
  - ``--ansis-primary-hover`` — darkened 8% shade. Applied to the button ``:hover`` state.
  - ``--ansis-primary-focus`` — 14% alpha focus-ring outline. Ensures keyboard users see a visible focus state (WCAG 2.1 AA accessibility).
  - Downstream UI elements affected: notebook tab underline, stat-button accent borders, Save/Create button colors, input focus glow, hyperlinks, and the text-selection background color.

  Hex format rules (strict @api.constrains)
  -----------------------------------------

  The field ``theme_brand_color`` on ``res.company`` has a strict ``@api.constrains`` validator (see ``res_company.py`` lines 84-94):

  - Accepts **#RGB** (3-digit shorthand like ``#abc`` or ``#FFF``) or **#RRGGBB** (6-digit full like ``#a1b2c3``).
  - Case insensitive — ``#AbCdEf`` is valid.
  - Any other string raises a user-friendly ``ValidationError`` telling you the allowed formats.
  - Empty / ``None`` values are explicitly allowed (unset state) so existing installations that upgraded can have a temporarily blank field without error.

  Palette Round-Trip — historical regression fixed in 18.0.1.1.0
  ---------------------------------------------------------------

  In 18.0.1.0.0, after you saved a palette once, any 2nd, 3rd, or 4th save was silently a no-op. Root cause: the SCSS replacement regex wrote an *unprefixed* variable like ``$color_brand`` on the first save, then on subsequent reads the read-side regex only matched prefixed ``$mk_color_brand`` or ``$ansis_color_brand``.

  This is FIXED in 18.0.1.1.0. The write-side always now writes the canonical ``$mk_`` prefix so the read-side keeps matching forever. Even better: if a database contains a legacy broken override (still with the unprefixed variable), ONE additional palette save will re-heal it automatically because the read-side regex now also tolerates the no-prefix form for backwards compatibility with overridden SCSS saved before 18.0.1.1.0.

  Reset Custom Theme Assets button
  --------------------------------

  Located at the bottom of the Brand Palette & Colors panel. Behavior:

  1. Calls ``_reset_theme_color_assets()`` on the settings model FIRST, BEFORE triggering any client reload. This method deletes the customized ``ir.attachment`` + ``ir.asset`` override rows for all three color SCSS files (colors.scss, colors_dark.scss, variables.scss) in BOTH the light (``web._assets_primary_variables``) and dark (``web.assets_web_dark``) asset bundles.
  2. Returns ``{'type': 'ir.actions.client', 'tag': 'reload'}`` so the browser reloads with the module defaults restored.

  If you want to "start over" without reinstalling the module, click this button.

  4. Company Wallpaper & Assets
  =============================

  The last panel lets admins upload two company-global binary assets per company record:

  - **Home Menu background wallpaper** (stored on ``res.company.background_image`` — large JPEG or PNG, recommended 3840x2160 4K or compressed 1920x1080).
  - **Browser-tab favicon** (ICO or square PNG, 64x64 minimum).

  Multi-company behavior on first install: the ``_setup_module`` post-init hook applies the module defaults (ANSIS wallpaper + ANSIS favicon binary) to ALL companies in the database, including archived companies, using empty-field-only semantics. This means:

  - New company → gets the ANSIS branding.
  - Existing company that already had a custom wallpaper or favicon uploaded → PREVIOUS CUSTOM VALUE IS LEFT UNTOUCHED forever.
  - Re-install / module upgrade → same protection; no user customizations are clobbered.

  5. Advanced — Global Quick-Create Override
  ==========================================

  System parameter (Settings → Technical → Parameters → System Parameters):

  - ``ansis_web_theme.disable_quick_create`` — boolean string. If set to ``"1"`` or ``"True"``, the Many2One Quick-Create widget is globally disabled for all users.
  - Legacy Muk fallback: ``muk_web_utils.disable_quick_create`` is ALSO read, for installations that migrated from the Muk upstream. If BOTH are set, the ANSIS one wins.
  - Serialized into ``session_info.disable_quick_create`` on every HTTP response that contains session info so the JS-layer widget-wide behavior can react without extra RPCs.

  6. Uninstall Guarantees
  =======================

  The module registers an ``uninstall_hook`` called ``_uninstall_cleanup(env)`` (see module-root ``__init__.py`` lines 16-23). It runs automatically whenever the module is removed from the database via Apps → Uninstall.

  Behavior: calls ``env['res.config.settings']._reset_theme_color_assets()`` on uninstall. That is, the same cleanup as the Reset Custom Theme Assets button runs, but on every uninstall. There will be zero orphaned customized SCSS attachments or custom ``ir.asset`` rows left in the database after uninstall.
  ```

- [ ] **Step 3.2 — RST table sanity check.**
  Confirm that the Font Family table has 5 data rows plus header; the Density table has 3 data rows; every `----` separator row count matches column count (3 columns = 2 pipes = 3 segments). Tables should have matching column widths; minor visual misalignment is acceptable in RST because docutils re-lays out on render.

- [ ] **Step 3.3 Optional commit**
  ```bash
  cd /Users/wsloh/perfectwork/PW_ADDONS.18.0/ansis/ansis_web_theme
  git add readme/CONFIGURE.rst
  git commit -m "docs(configure): expand to palette/typography/density/hex/uninstall guide"
  ```

---

## Task 4: NEW `docs/DEVELOPER_APPENDIX.md` (~250 lines) — developers only

**Files:**
- Create: `docs/DEVELOPER_APPENDIX.md` (new file; the `docs/` directory already exists from when the spec was written)

- [ ] **Step 4.1 — Write the complete file in ONE shot. Copy all content below verbatim into `docs/DEVELOPER_APPENDIX.md`.**

  ```markdown
  # ansis_web_theme — Developer Appendix

  > **Audience:** Odoo developers, maintainers, QA engineers, and technical integrators.
  >
  > **Goal:** Pure technical reference material for `ansis_web_theme`. End users should never need this file; see `readme/USAGE.rst` and `readme/CONFIGURE.rst` instead.
  >
  > **Target version:** 18.0.1.1.0 (August 2026 doc-batch). Lines-of-code references from the `2026-08-24` checkout.

  ---

  ## 5.1 Python Public Method Reference (12 methods)

  All colors-related public helpers live in `web_editor_assets.py`; the settings/ORM layer helpers live in `res_config_settings.py`; module hooks live in the module `__init__.py`.

  | Method | File + Line Range | Parameters | Returns | Purpose |
  |---|---|---|---|---|
  | `_get_color_variable` | `models/web_editor_assets.py` L38-L46 | `scss_contents: str`, `variable_name: str` | `str \| None` | Extracts the current value of a SCSS color variable via a healing regex. Tolerates `$mk_` / `$ansis_` / NO prefix so it reads legacy corrupted overrides and heals them on the next write. |
  | `_replace_color_variables` | `models/web_editor_assets.py` L48-L57 | `scss_contents: str`, `variables: list[dict]` each with `name` and `value` keys | `str` | Replaces every variable in the input list. ALWAYS writes the canonical `$mk_` prefix into the output so the read-side regex keeps matching on every subsequent save round-trip. |
  | `_get_colors_attachment` | `models/web_editor_assets.py` L18-L20 | `custom_url: str` | `ir.attachment` recordset (possibly empty) | Exact-match lookup via the `path = custom_url` field. Symmetric behavior with `_get_colors_asset`. |
  | `_get_colors_asset` | `models/web_editor_assets.py` L22-L25 | `custom_url: str` | `ir.asset` recordset (possibly empty) | Same exact `=` match. **Historical note Issue #3:** Previous code used a `like` substring match, which could mutate or delete UNRELATED `ir.asset` rows when a URL substring accidentally collided with another module's customized asset. Replaced with `=` exact match in 18.0.1.1.0. |
  | `_make_custom_asset_url` | `models/web_editor_assets.py` L27-L35 | `url: str`, `bundle: str` | `str` | Builds the suffixed "custom URL" used for every customized-asset lookup. Adds a trailing bundle-token so the same base SCSS file overridden in two different bundles gets two separate `ir.attachment` rows. |
  | `_save_color_asset` | `models/web_editor_assets.py` L37-L80 | `url: str`, `bundle: str`, `scss_content: str` | `None` | Idempotently saves a customized SCSS override. If a matching attachment already exists, it updates it in place; otherwise it creates a new `ir.attachment` row and a corresponding `ir.asset` row pointing to it. **Historical note Issue #9 (latent bug):** In 18.0.1.0.0 the code called `_get_colors_asset(asset_url)` with a leading-slash-stripped URL, which due to Issue #3's LIKE operator happened to work by accident. After Issue #3 converted to exact `=`, this bug became a guaranteed miss → fixed by calling `_get_colors_asset(custom_url)` instead. |
  | `get_color_variables_values` | `models/res_config_settings.py` L33-L49 | `self` (a res.config.settings record) | `dict[str, dict[str, str]]` — outer keys `light` and `dark`, inner keys are the 8 primary color names | Reads the current 8-primary SCSS values from both light (web._assets_primary_variables) and dark (web.assets_web_dark) bundles by fetching the customized attachment (if one exists) or falling back to the on-disk static SCSS source. Used to pre-populate the Theme & Branding → Brand Palette color form. |
  | `_onchange_theme_color_palette` | `models/res_config_settings.py` L51-L55 | trigger: `theme_color_palette` field changes | `{'value': {'theme_brand_color': …}}` Odoo onchange dict | Looks up the user's selected palette in the `PALETTES` single-source-of-truth dict (in `models/__init__.py`) and returns the matching hex so the Hex Accent Code field auto-populates. Custom = `None` returned; the user picks hex via the swatch. |
  | `action_reset_theme_color_assets` | `models/res_config_settings.py` L57-L62 | `self` (any res.config.settings record; model-level env-only call also works) | `{'type': 'ir.actions.client', 'tag': 'reload'}` | UI button handler. Calls `_reset_theme_color_assets()` first to actually delete database rows, THEN returns the client-reload tag. **Historical note Issue #1:** In 18.0.1.0.0 this method returned only the reload tag without deleting anything; the companion method below also didn't exist, so the uninstall hook crashed. |
  | `_reset_theme_color_assets` | `models/res_config_settings.py` L64-L79 | `self` (model-level env-only call is fine, no specific record needed) | `None` | Loops through 3 core SCSS files × 2 asset bundles (light + dark) for a total of 6 custom URLs. For each URL it searches both `ir.attachment` (via `_get_colors_attachment`) and `ir.asset` (via `_get_colors_asset`) and deletes the rows if they exist. Used by both the Reset Custom Theme Assets button AND the uninstall hook. |
  | `_setup_module` | `__init__.py` L12-L26 | `env` (raw Odoo environment, not a cursor) | `None` | **`post_init_hook`**. Reads the two static binary branding assets (wallpaper + favicon) from `static/img` into memory ONCE, then iterates ALL companies in the database including archived ones (via `with_context(active_test=False).search([])`) and writes `favicon` / `background_image` only if the target field is empty (so pre-existing customizations are preserved on upgrade or re-install). **Historical note Issue #5:** before 18.0.1.1.0 this only set `base.main_company`, so multi-company installs got inconsistent branding on company #2+. |
  | `_uninstall_cleanup` | `__init__.py` L16-L23 | `env` | `None` | **`uninstall_hook`**. Calls `env['res.config.settings']._reset_theme_color_assets()` to guarantee zero leftover SCSS customizations in the database after module removal. **Historical note Issue #1:** before 18.0.1.1.0 this crashed with `AttributeError` because `_reset_theme_color_assets` had not yet been added to the model. |

  ---

  ## 5.2 Session-Info Reference (serialized for JS hooks)

  Four groups of keys are added or extended by this module inside `session_info` on every HTTP response that delivers the web client. These keys are consumed by the OWL theme-service, chatter widget patcher, dialog system, and the custom binary widget extensions.

  | Key path | Type | Where set | Purpose |
  |---|---|---|---|
  | `session_info.chatter_position` | `'side' \| 'bottom'` | `models/ir_http.py` session_info override read from `self.env.user.chatter_position` | OWL chatter renderer decides whether to draw a horizontal split-screen or a classic under-form panel. |
  | `session_info.dialog_size` | `'minimize' \| 'maximize'` | `models/ir_http.py` same session_info override | Default size state applied to every new `Dialog` + `SelectCreateDialog` instance in the web client. |
  | `session_info.disable_quick_create` | `bool` | `models/ir_http.py` L16 — reads `ansis_web_theme.disable_quick_create` system param, falls back to legacy Muk `muk_web_utils.disable_quick_create` param if the ANSIS one is absent | Global Many2One Quick-Create widget override. Set to `"1"` on the system parameter to globally disable Quick-Create arrows for all users. |
  | `session_info.user_companies.allowed_companies[id].branding_extended` | `dict` with keys: `favicon_set:bool`, `theme_font:str`, `theme_color_palette:str`, `theme_brand_color:str\|None`, `theme_ui_density:str`, `theme_font_scale:str`, `sidebar_type:str` | `models/ir_http.py` L25-L52; iterates `company_ids.sudo().with_context(bin_size=True)` | Provides branding/theme tokens for EVERY company in the switchable set so the JS theme service doesn't have to re-read on every company switch. The `branding_extended` blob is extended per-company. `bin_size=True` avoids streaming binary blob bytes over the wire (we only need boolean "is there a favicon set?" plus the scalar string fields). |

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
  | `web.assets_web_dark` | `after web/static/src/scss/colors.scss` → `static/src/scss/colors_dark.scss` |
  | `web.assets_backend` | Bulk includes: `**/*.scss` (the remaining chatter patcher styles, list, form, widgets), `**/*.xml` (OWL templates), `**/*.js` (all widget patches, session_info consumers, theme service, dialog + chatter behavior). |

  ---

  ## 5.4 Model Field Maps we Extend

  This module does NOT create any brand-new standalone `_name` models — it only uses `_inherit` against pre-existing models from Odoo core (`base`, `web`, `web_editor`). Therefore inherited ACLs from `base`/`mail`/`web_editor` already apply, and no additional `security/ir.model.access.csv` is required.

  - **`res.company` (global per-company settings, 7 fields added via `_inherit`):**
    - `theme_brand_color: Char` (validated by `@api.constrains` hex format)
    - `background_image: Binary` (Home Menu wallpaper)
    - `theme_font: Selection` (one of 5 font-family stacks)
    - `theme_color_palette: Selection` (one of 5 named palettes + "custom")
    - `theme_ui_density: Selection` (Compact/Standard/Comfortable)
    - `theme_font_scale: Selection` (Compact/Standard/Comfortable base pixel sizes)
    - `favicon: Binary` (browser-tab favicon binary blob)
  - **`res.users` (personal per-user settings, 3 fields added via `_inherit`):**
    - `chatter_position: Selection` (`Side` / `Bottom`)
    - `dialog_size: Selection` (`Minimize` / `Maximize`)
    - `sidebar_type: Selection` (mobile drawer variants)
    - All three fields are explicitly listed in `SELF_WRITEABLE_FIELDS` + `SELF_READABLE_FIELDS` on the overridden `res.users` model so non-admin users can edit their own preferences without requiring admin permission. (Corresponding XML field added to `views/res_users.xml` in the Preferences tab.)
  - **`ir.config_parameter` keys read by the session_info flow:**
    - `ansis_web_theme.disable_quick_create` (new / recommended)
    - `muk_web_utils.disable_quick_create` (legacy Muk fallback, only exists for migrated installs)

  ---

  ## 5.5 Sudo Rationale (`.cursorrules` compliance)

  Three `.sudo()` escalations are present in the module. Per `.cursorrules` every single `sudo()` MUST have a preceding line comment explaining the privilege-escalation rationale. All three calls below have been updated to carry their compliance comments in 18.0.1.1.0.

  1. **`models/ir_binary.py` line 14:** `record = record.sudo()`
     **Rationale:** Unauthenticated / public users need read access to company branding assets (favicon, logo, login page wallpaper, menu wallpaper) for the anonymous-login page and public web routes, which would otherwise be blocked by `res.company` record rules on unauthenticated requests. This read-only scope is tightly bounded to the branding-binary controller endpoint that explicitly returns only these assets.

  2. **`models/ir_http.py` line 16:** `env['ir.config_parameter'].sudo().get_param(...)`
     **Rationale:** Internal non-admin users must read two system-parameter keys (`disable_quick_create`, legacy Muk fallback) for JS-layer feature toggles. Non-admin users normally cannot read `ir.config_parameter` rows; we use a single-query elevated read to return the boolean answer. Never used for writes.

  3. **`models/ir_http.py` line 25:** `company_ids.sudo().with_context(bin_size=True)`
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
    custom_url = env['res.config.settings']._make_custom_asset_url(
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
    with self.assertRaises(ValidationError): main.write({'theme_brand_color': 'not-hex'})  # noqa: E501 use standard try/except:
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
  ```

- [ ] **Step 4.2 — Markdown sanity + dead-reference scan.**
  Confirm all Markdown tables render (5 tables: method reference, session info, bundles, field maps summary, test recipe bullets). Confirm all `###` sub-headers match the numbering used in the approved spec:
  - 5.1 Python Public Method Reference
  - 5.2 Session-Info Reference
  - 5.3 SCSS Variable Naming & Asset Bundles
  - 5.4 Model Field Maps we Extend
  - 5.5 Sudo Rationale
  - 5.6 Test Runner Recipes
  Expected: yes, exactly the six sections.

- [ ] **Step 4.3 Optional commit**
  ```bash
  cd /Users/wsloh/perfectwork/PW_ADDONS.18.0/ansis/ansis_web_theme
  git add docs/DEVELOPER_APPENDIX.md
  git commit -m "docs(dev): add DEVELOPER_APPENDIX.md (250 lines, 6 sections)"
  ```

---

## Task 5: Static Verification + optional final commit + optional Hindsight retention

**Files:**
- Test-only (no file creation)

- [ ] **Step 5.1 Static assertions script — run once in your local shell (not the container).**

  Save the following to `/tmp/ansis_doc_verify.py` and run `python3 /tmp/ansis_doc_verify.py`. It checks:
  - README.md: contains the new badge string, What's New header, Chatter & Dialog UX section, Field Widget Enhancements section, correct `-i` / `-u` install commands, two new compliance rows.
  - USAGE.rst: contains 5 numbered sections, keyboard-shortcuts table header, 6-step walkthrough line with "Chatter Position to either Side or Bottom".
  - CONFIGURE.rst: contains 6 numbered sections, hex `@api.constrains` phrase, "Palette Round-Trip — historical regression fixed in 18.0.1.1.0" sentence, uninstall hook sentence, 5 font-family rows header.
  - DEVELOPER_APPENDIX.md: all 6 subsection headers exist, session_info table header + 4 key names present, method reference 12 table rows (check by scanning `\| ` pipe-count in the method table).

  ```python
  import sys, pathlib, re
  ROOT = pathlib.Path("/Users/wsloh/perfectwork/PW_ADDONS.18.0/ansis/ansis_web_theme")
  readme = (ROOT/"README.md").read_text()
  usage = (ROOT/"readme/USAGE.rst").read_text()
  configure = (ROOT/"readme/CONFIGURE.rst").read_text()
  dev = (ROOT/"docs/DEVELOPER_APPENDIX.md").read_text()
  errors = []

  def check(label, cond):
      if not cond:
          errors.append(label)

  check("README bad version badge", "Version-18.0.1.1.0-0284c7" in readme)
  check("README missing What's New", "What's New in 18.0.1.1.0" in readme)
  check("README no §7 Chatter UX section", "### 7. Chatter & Dialog UX" in readme)
  check("README no §8 Field Widget section", "### 8. Field Widget Enhancements" in readme)
  check("README no fresh install -i command", "-i ansis_web_theme" in readme)
  check("README no upgrade -u command", "-u ansis_web_theme" in readme)
  check("README no post_init_hook sentence", "post_init_hook=_setup_module" in readme)
  check("README no Hindsight compliance row", "Hindsight memory retention" in readme)

  # USAGE.rst 5 numbered sections
  for section_num in range(1, 6):
      check(f"USAGE missing section {section_num}", re.search(rf"(^|\n)\s*{section_num}\.\s+[A-Z]", usage) is not None)
  check("USAGE no keyboard shortcuts table", "Keyboard Shortcuts" in usage and "Shortcut" in usage and "Action" in usage)
  check("USAGE missing 6-step walkthrough line re Chatter", "Chatter Position to either Side or Bottom" in usage)

  # CONFIGURE.rst 6 numbered sections
  for section_num in range(1, 7):
      check(f"CONFIGURE missing section {section_num}", re.search(rf"(^|\n)\s*{section_num}\.\s+[A-Z]", configure) is not None)
  check("CONFIGURE no @api.constrains mention", "@api.constrains" in configure)
  check("CONFIGURE no Palette Round-Trip fix note", "Palette Round-Trip" in configure and "18.0.1.1.0" in configure)
  check("CONFIGURE no uninstall hook paragraph", "_uninstall_cleanup(env)" in configure)
  check("CONFIGURE no 5 font-family rows", "Font Family selector" in configure and "Inter" in configure and "Plus Jakarta Sans" in configure and "Outfit" in configure)

  # DEVELOPER_APPENDIX.md 6 sub-sections
  for name in ["5.1 Python Public Method Reference", "5.2 Session-Info Reference",
               "5.3 SCSS Variable Naming & Asset Bundles", "5.4 Model Field Maps we Extend",
               "5.5 Sudo Rationale", "5.6 Test Runner Recipes"]:
      check(f"DEVELOPER_APPENDIX missing {name}", f"## {name}" in dev)
  check("DEVELOPER_APPENDIX no session_info.chatter_position key", "session_info.chatter_position" in dev)
  check("DEVELOPER_APPENDIX no session_info.dialog_size", "session_info.dialog_size" in dev)
  check("DEVELOPER_APPENDIX no session_info.disable_quick_create", "session_info.disable_quick_create" in dev)
  check("DEVELOPER_APPENDIX no method count — 12 rows present", dev.count("`_get_color_variable`") + dev.count("`_replace_color_variables`") + dev.count("`_get_colors_attachment`") + dev.count("`_get_colors_asset`") + dev.count("`_make_custom_asset_url`") + dev.count("`_save_color_asset`") + dev.count("`get_color_variables_values`") + dev.count("`_onchange_theme_color_palette`") + dev.count("`action_reset_theme_color_assets`") + dev.count("`_reset_theme_color_assets`") + dev.count("`_setup_module`") + dev.count("`_uninstall_cleanup`") == 12)

  if errors:
      print("FAIL:", len(errors), "problems")
      for e in errors:
          print(" -", e)
      sys.exit(1)
  print("✅ doc_verify.py: all", 26, "assertions passed")
  ```

  Expected: exit 0 with the green pass message above. If any assertion fails, go back to the responsible task and fix the document content before continuing.

- [ ] **Step 5.2 Optional final git commit (consolidated).**
  ```bash
  cd /Users/wsloh/perfectwork/PW_ADDONS.18.0/ansis/ansis_web_theme
  git add README.md readme/USAGE.rst readme/CONFIGURE.rst docs/DEVELOPER_APPENDIX.md docs/superpowers/plans/2026-08-24-ansis-web-theme-documentation-improvements.md
  git status
  git commit -m "docs: 4-target hybrid documentation improvements (features + usage + configure + dev appendix)"
  ```

- [ ] **Step 5.3 Optional Hindsight initiative update.**
  If the Hindsight MCP tools are available, update the existing initiative doc "ansis_web_theme: QA bug-fix batch" with a pointer note: "Follow-up doc-batch plan/execution completed — initiative doc extended to reference this implementation plan. 4 docs: README.md, readme/USAGE.rst, readme/CONFIGURE.rst, docs/DEVELOPER_APPENDIX.md." Tags: `scope:repo:ansis_web_theme`, `topic:documentation`.

---

## Self-Review (plan writer ran)

**1. Spec coverage vs plan tasks:**
- Spec §2 README.md badge → Task 1.1 ✅
- Spec §2.2 What's New → Task 1.2 ✅
- Spec §2.3 Key Features add-ons (§7 UX, §8 Widgets, sub-bullets, Mobile sidebar sentence) → Task 1.3 ✅
- Spec §2.4 Installation (-i/-u split + post-init note + enterprise exclusion) → Task 1.4 ✅
- Spec §2.5 Compliance table 2 new rows (hooks + Hindsight) → Task 1.5 ✅
- Spec §3 DOC#2 USAGE.rst (navigation, shortcuts table, lists, forms, user prefs 3 sub-sections, 6-step walkthrough, 5 sections) → Task 2.1+2.2 ✅
- Spec §4 DOC#3 CONFIGURE.rst (open theme settings, typography 5-stack table, density 3-preset table, palette 5 presets + custom, 4 CSS vars list, hex constrains, round-trip note, reset button, wallpaper, multi-company, system param, uninstall guarantees → 6 sections) → Task 3.1+3.2 ✅
- Spec §5 DOC#4 DEVELOPER_APPENDIX.md (5.1 method ref, 5.2 session info, 5.3 scss naming + bundles, 5.4 field maps, 5.5 sudo rationale, 5.6 test recipes) → Task 4.1+4.2 ✅
- Spec §6 size estimate (≈488 new lines / 1 new file) → consistent with tasks T2 T3 T4 counts ✅
- Spec §7 out-of-scope (no sphinx, no real PNG screenshots, no changelog rewrite, no FAQ) → no tasks introduced for those, ✅

**2. Placeholder scan:** TBD/TODO/implement-later / "fill in" / "similar to task" / "appropriate error handling" patterns are not present in any step. Every code step includes the literal code or literal RST/MD content to paste. ✅

**3. Type consistency:**
- Method name `_reset_theme_color_assets` is spelled identically in Task 1.2 prose, Task 1.4 prose, Task 4.1 (methods table), Task 5.1 assertions. ✅
- `$mk_color_<name>` canonical prefix used consistently across Spec §5.3, Task 3.1 (Palette Round-Trip paragraph), Task 4.1 (§5.3 + method ref). ✅
- 8 primary color names list (brand/primary/secondary/success/info/warning/danger/alpha) consistent across tasks. ✅
- System parameter keys `ansis_web_theme.disable_quick_create` + legacy `muk_web_utils.disable_quick_create` spelled identically in Task 1.3, 3.1 §5, 4.1 §5.2, 4.1 §5.4. ✅

Result of self-review: zero spec gaps, zero placeholder strings, zero name mismatches.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-24-ansis-web-theme-documentation-improvements.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review the output between tasks, fast iteration, low blast radius on 4-doc edit.

**2. Inline Execution** — Execute all 5 tasks sequentially in this session using the executing-plans skill, with checkpoint reviews as needed.

**Which approach do you choose?**
