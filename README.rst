===============
ANSIS Web Theme
===============

.. image:: https://img.shields.io/badge/license-LGPL--3-blue.svg
   :target: https://www.gnu.org/licenses/lgpl-3.0-standalone.html
   :alt: License: LGPL-3
.. image:: https://img.shields.io/badge/version-18.0.1.2.3-informational.svg
   :target: https://github.com/ansis-ai/ansis_web_theme
   :alt: Version: 18.0.1.2.3
.. image:: https://img.shields.io/badge/Odoo-18.0-blue.svg
   :target: https://github.com/ansis-ai/ansis_web_theme
   :alt: Odoo: 18.0

**ANSIS Web Theme** is a modern, light SaaS backend theme for **Odoo 18.0 Community Edition**.

It delivers enterprise-grade UX ergonomics, dynamic typography, brand color generation, minimalist 1-line inputs, unified app cards, drag-and-drop dashboard reordering, sticky list headers, and responsive mobile offcanvas navigation without any proprietary enterprise dependencies.

.. contents:: Table of contents
   :depth: 2
   :local:

Features
========

* **Modern Light SaaS Palette & Tokens**: Sapphire blue primary accents (``#0284c7``), clean slate typography, and elevated card shadows.
* **Smart Navigation**:
  - Multi-level nested cascading flyout submenus (``pw_theme_layout`` style) with rightward angle chevrons (``\f105``) and full hierarchical active menu highlighting.
  - Interactive top-left brand chevron (``<``) transforming on hover (``Application`` → ``< Application``) to open the Home Menu overlay.
  - Automatic ``+`` dropdown for overflowing navbar submenus with boundary-aware adapt measurement to prevent right-side systray overlap.
  - Boundary-safe submenu flyouts with ``left-start`` positioning in More dropdown and viewport clamping.
  - 100% full-width screen layout (neutralizes redundant left sidebars).
  - Systray items pinned to the far right with floating pill notification badges.
* **Instant App Dashboard**:
  - Fullscreen app card overlay with standardized ``104×124px`` tiles.
  - Instant client-side search filter with autofocus and ``ESC`` clear.
  - Full keyboard navigation (Arrow keys, Home/End, Enter).
  - HTML5 drag-and-drop dashboard tile reordering with hybrid persistence.
  - Multi-company custom wallpaper with sudo-safe asset streaming.
* **Enhanced Data & List Views**:
  - Sticky table headers (``thead``) with drop elevation shadow during vertical scrolling.
  - Frozen selection checkbox column on the left during horizontal scrolling.
  - Sticky footer aggregates (``tfoot``) pinned to the bottom.
  - Column resizing and optional columns selector.
* **Modern Minimalist Form Views**:
  - 1-line underline input fields (``border-bottom: 1px solid #cbd5e1``) replacing bulky rounded boxes.
  - Underline notebook tabs with badge pill counters.
  - Elevated metric stat buttons with hover lift animations.
  - Statusbar pipeline with pill-style chevrons.
* **Dedicated Application Settings**:
  - Standalone **"Theme & Branding"** tab in Settings.
  - Dynamic typography font selector (*Inter, Plus Jakarta Sans, Roboto, Outfit, System Default*).
  - UI Layout Density controls (Compact / 32px rows, Standard / 40px rows, Comfortable / 48px rows).
  - Primary brand color picker with automated light tint and hover calculation.
* **Mobile Offcanvas Drawer (< 768px)**:
  - User profile tile with avatar, name, and active company badge.
  - Primary 1-tap **"All Apps / Dashboard"** jump button.
  - Touch-optimized nested submenu tree (``44px`` touch targets).

Configuration
=============

To customize company typography, colors, and branding:

1. Navigate to **Settings > Theme & Branding**.
2. Select your preferred **Font Family**, **Base Font Scale**, and **UI Layout Density**.
3. Choose your **Primary Brand Accent** color.
4. Upload custom **Home Menu Wallpaper** and **Browser Tab Favicon**.
5. Save settings. Changes apply across all active users in the company immediately.

Usage
=====

1. **Open Home Menu**: Click the active app brand in the top-left navbar.
2. **Search Apps**: Start typing anywhere in the Home Menu overlay to filter apps instantly.
3. **Reorder Apps**: Click and drag any app tile to a new position on the dashboard.
4. **Mobile Navigation**: On screens < 768px, tap the burger menu icon to open the slide-out drawer.

Known issues / Roadmap
======================

* Phase 8: Native consolidation of Muk dependencies (``muk_web_chatter``, ``muk_web_dialog``, ``muk_web_appsbar``, ``muk_web_colors``) into a single standalone module.

Bug Tracker
===========

Bugs are tracked on `GitHub Issues <https://github.com/ansis-ai/ansis_web_theme/issues>`_.
In case of trouble, please check there if your issue has already been reported.

Credits
=======

Authors
~~~~~~~

* ANSIS Pte Ltd
* MuK IT

Contributors
~~~~~~~~~~~~

* Wilson Loh <wilson@ansis.com.sg>
* ANSIS Pte Ltd <https://ansis.com.sg>
* Mathias Markl <mathias.markl@mukit.at>
* MuK IT GmbH & Co. KG <https://www.mukit.at>

Maintainers
~~~~~~~~~~~

This module is maintained by `ANSIS Pte Ltd <https://ansis.com.sg>`_.
