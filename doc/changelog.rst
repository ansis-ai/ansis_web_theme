Changelog
=========

`18.0.1.2.4`
------------
* **Fix undefined appbar_image field error in Settings**:
  - Restored ``appbar_image`` binary field on ``res.company`` and ``res.config.settings`` for backward compatibility with databases containing legacy views.
  - Prevents Owl client-side crash (`res.config.settings.appbar_image field is undefined`) when opening the Settings app.

`18.0.1.2.3`
------------
* **Guaranteed '+' More Button Visibility on Narrow Screens**:
  - Added ``d-none`` class binding directly onto section ``<button>`` elements in ``web.NavBar.SectionsMenu`` Owl template to ensure overflowing sections collapse to 0px.
  - Set ``min-width: 44px !important`` and ``flex: 1 1 auto !important`` on ``.o_menu_sections`` so flexbox can never crush the container or hide the ``(+)`` button.
  - Allowed brand text to shrink gracefully (``flex-shrink: 1``, ``max-width: 220px``, ``text-overflow: ellipsis``) on constrained screens.
  - Added instant ``ResizeObserver`` on the navbar container for real-time zero-lag adaptation upon browser window resizing.
  - Enhanced the ``(+)`` button styling with visible borders and subtle shadow.

`18.0.1.2.2`
------------
* **Reactive '+' More Button & Small Screen Visibility**:
  - Bound reactive ``d-none`` visibility (``isSectionExtra(section)``) in ``web.NavBar.SectionsMenu`` Owl template so overflowing sections take 0px and never push the ``(+)`` More button off-screen.
  - Enabled ``SectionsMenu`` across all screen sizes (including < 768px) so that when screen width is small, menu items collapse cleanly into the ``(+)`` sign instead of disappearing.
  - Moved ``.o_menu_sections`` and ``.o_menu_sections_more`` styling outside the desktop-only media query, adding mobile button styles.

`18.0.1.2.1`
------------
* **Navbar Overflow & Overlap Prevention on Smaller Screens**:
  - Implemented boundary-aware ``adapt()`` calculation in ``NavBar`` measuring actual available space between brand and systray boundaries.
  - Added strict Flexbox sizing constraints (``flex: 1 1 0%``, ``min-width: 0``, ``overflow: hidden``) to ``.o_menu_sections`` and ``flex-shrink: 0`` to brand, systray, and More button to prevent menu collisions and overlaps on right navbar edge.
  - Added ``position="'left-start'"`` for nested submenus originating from ``MoreDropdown`` to open safely away from the right screen boundary.
  - Added automatic adaptation triggers on action updates (``ACTION_MANAGER:UI-UPDATED``) and font ready states.

`18.0.1.2.0`
------------
* **Multi-Level Nested Submenus Cascading (`pw_theme_layout` style)**:
  - Extended ``web.NavBar.SectionsMenu.Dropdown.MenuSlot`` and ``web.NavBar.SectionsMenu.MoreDropdown`` to recursively render nested ``Dropdown`` components for submenus with child trees.
  - Enabled desktop flyout cascading to the right with FontAwesome rightward chevrons (``\f105``) and smooth hover transitions.
  - Added pure Owl reactive active menu tracking (``isMenuActive(menu)``) that simultaneously highlights active leaf items, intermediate dropdown triggers, and the top-level navbar section button.
  - Added active menu state synchronization (``_syncActiveMenu()``) on ``ACTION_MANAGER:UI-UPDATED`` and URL ``#menu_id=...`` changes.
  - Moved dropdown menu styles to ``.o-overlay-container, .o_web_client`` to support Odoo 18's popover overlay portal architecture.

`18.0.1.1.0`
------------
* Fix uninstall crash by adding ``_reset_theme_color_assets`` to ``res.config.settings``.
* Fix palette round-trip bug by writing canonical ``$mk_`` prefix on color variable replacements.
* Ensure multi-company branding defaults on install for all companies including archived records.

`18.0.1.0.0`
------------
* Initial release of ANSIS Web Theme for Odoo 18.0 Community Edition.
* Modern Light SaaS color scheme and sapphire blue accents.
* Interactive brand chevron back navigation (<).
* Instant Home Menu overlay with real-time app search filter.
* HTML5 drag-and-drop dashboard app tile reordering with hybrid persistence.
* Full keyboard navigation (Arrow keys, Home, End, Enter) in Home Menu.
* Multi-company wallpaper background integration with sudo-safe asset streaming.
* Sticky table headers (thead), frozen selection column, and sticky aggregates footer (tfoot).
* Underline notebook tabs, 1-line minimalist inputs, and elevated stat buttons.
* Dedicated "Theme & Branding" Application Settings section.
* Dynamic typography font family selection (*Inter, Plus Jakarta Sans, Roboto, Outfit, System Default*).
* UI Layout Density scaling (Compact / 32px, Standard / 40px, Comfortable / 48px).
* Dynamic brand palette generator with automatic light tint and hover calculation.
* Mobile offcanvas sidebar drawer with user profile card and 1-tap All Apps button.
* Full OCA compliance with LGPL-3 licensing, pre-commit config, and documentation fragments.
