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

+-------------------+-----------------------+-----------------------------------------------+
| Option            | Font Stack            | Use case recommendation                         |
+===================+=======================+=================================================+
| Inter             | Inter (Modern SaaS)   | Default. Modern geometric sans.                 |
+-------------------+-----------------------+-------------------------------------------------+
| Plus Jakarta Sans | Geometric Humanist    | Rounded terminals, highly legible body text.    |
+-------------------+-----------------------+-------------------------------------------------+
| Roboto            | Neutral Enterprise    | Google / Material Design familiarity.           |
+-------------------+-----------------------+-------------------------------------------------+
| Outfit            | Round Sans            | Friendly soft edges for customer portals.       |
+-------------------+-----------------------+-------------------------------------------------+
| Apple System      | Native OS             | Best performance on macOS / iOS — uses the      |
|                   |                       | OS default SF Pro stack.                        |
+-------------------+-----------------------+-------------------------------------------------+

UI Layout Density — 3 presets with row-height guarantees
---------------------------------------------------------

+-------------+----------------------+------------------------------------------------+
| Preset      | Base list row height | Use case                                       |
+=============+======================+================================================+
| Compact     | 32 px                | High-volume data entry, list-heavy users like  |
|             |                      | accountants, inventory managers.               |
+-------------+----------------------+------------------------------------------------+
| Standard    | 40 px                | Modern SaaS default. Recommended default.      |
+-------------+----------------------+------------------------------------------------+
| Comfortable | 48 px                | Spacious enterprise layout. Touch-friendly for |
|             |                      | convertible laptops or kiosks.                 |
+-------------+----------------------+------------------------------------------------+

Base Font Scale accompanies the density: Compact = 13px; Standard = 14px; Comfortable = 15px. On save, two CSS variables are injected into the document root: ``--ansis-font-sans`` (the chosen font-family stack) and ``--ansis-font-size-base`` (the computed pixel size).

3. Brand Palette & Colors
=========================

This panel is the heart of the module. Picking a brand color recalculates all theme accent tokens in real time and writes a customized SCSS override into the database.

Five preset palettes + Custom Hex
---------------------------------

- **Sapphire Blue #0284c7** (factory default — professional, calm, neutral SaaS)
- **Royal Violet #7c3aed** — for luxury, legal, or creative agencies
- **Emerald Green #059669** — sustainability, healthcare, fintech
- **Berry Rose #db2777** — retail, fashion, cosmetics, e-commerce
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
2. Deletes ``ir.attachment`` and ``ir.asset`` rows for 3 SCSS files across 2 bundles for a total of 6 custom URL targets.
3. Returns ``{'type': 'ir.actions.client', 'tag': 'reload'}`` so the browser reloads with the module defaults restored.

If you want to "start over" without reinstalling the module, click this button.

4. Company Wallpaper & Assets
=============================

The last panel lets admins upload two company-global binary assets per company record:

- **Home Menu background wallpaper** (stored on ``res.company.background_image`` — large JPEG or PNG, recommended 3840x2160 4K or compressed 1920x1080).
- **Browser-tab favicon** (ICO or square PNG, 64x64 minimum).

Multi-company behavior on first install: the ``_setup_module`` post-init hook applies the module defaults (ANSIS wallpaper + ANSIS favicon binary) to ALL companies in the database, including archived companies, using ``with_context(active_test=False)`` and empty-field-only semantics. This means:

- New company → gets the ANSIS branding.
- Existing company that already had a custom wallpaper or favicon uploaded → PREVIOUS CUSTOM VALUE IS LEFT UNTOUCHED forever.
- Re-install / module upgrade → same protection; no user customizations are clobbered.

5. Advanced - Global Quick-Create Override
==========================================

System parameter (Settings → Technical → Parameters → System Parameters):

- ``ansis_web_theme.disable_quick_create`` — boolean string. If set to ``"1"`` or ``"True"``, the Many2One Quick-Create widget is globally disabled for all users.
- Legacy Muk fallback: ``muk_web_utils.disable_quick_create`` is ALSO read, for installations that migrated from the Muk upstream. If BOTH are set, the ANSIS one wins (it is evaluated first with an ``or`` fallback to the legacy key).
- Serialized into ``session_info.disable_quick_create`` on every HTTP response that contains session info so the JS-layer widget-wide behavior can react without extra RPCs. The boolean is resolved via ``str2bool()`` with a ``False`` default.

6. Uninstall Guarantees
=======================

The module registers an ``uninstall_hook`` called ``_uninstall_cleanup(env)`` (see module-root ``__init__.py`` lines 29-30). It runs automatically whenever the module is removed from the database via Apps → Uninstall.

Behavior: calls ``env['res.config.settings']._reset_theme_color_assets()`` on uninstall. That is, the same cleanup as the Reset Custom Theme Assets button runs, but on every uninstall. There will be zero orphaned customized SCSS attachments or custom ``ir.asset`` rows left in the database after uninstall.
