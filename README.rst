===============
ANSIS Web Theme
===============

.. 
   .. image:: https://img.shields.io/badge/license-LGPL--3-blue.png
      :target: http://www.gnu.org/licenses/lgpl-3.0-standalone.html
      :alt: License: LGPL-3

.. image:: https://img.shields.io/badge/license-LGPL--3-blue.svg
   :target: https://www.gnu.org/licenses/lgpl-3.0-standalone.html
   :alt: License: LGPL-3
.. image:: https://img.shields.io/badge/version-18.0.1.0.0-informational.svg
   :target: https://github.com/ansis-ai/ansis_web_theme
   :alt: Version: 18.0.1.0.0
.. image:: https://img.shields.io/badge/Odoo-18.0-blue.svg
   :target: https://github.com/ansis-ai/ansis_web_theme
   :alt: Odoo: 18.0

**ANSIS Web Theme** is a modern, light SaaS backend theme for **Odoo 18.0 Community Edition**.

It delivers enterprise-grade UX ergonomics, sleek modern typography, unified app cards, drag-and-drop dashboard reordering, sticky list headers, and responsive mobile offcanvas navigation without any proprietary enterprise dependencies.

.. contents:: Table of contents
   :depth: 2
   :local:

Features
========

* **Modern Light SaaS Palette**: Sapphire blue primary accents (``#0284c7``), clean slate typography, and elevated card shadows.
* **Smart Navigation**:
  - Interactive top-left brand chevron (``<``) returning to the Home Menu overlay.
  - Automatic ``+`` dropdown for overflowing navbar submenus.
  - Systray items pinned to the far right with floating pill notification badges.
* **Instant App Dashboard**:
  - Fullscreen app card overlay with standardized ``104×124px`` tiles.
  - Instant client-side search filter with autofocus and ``ESC`` clear.
  - HTML5 drag-and-drop dashboard tile reordering with hybrid persistence (``localStorage`` + ``res.users.settings``).
  - Multi-company custom wallpaper with frosted-glass backdrop blur.
* **Enhanced Data & List Views**:
  - Sticky table headers (``thead``) with drop elevation shadow during vertical scrolling.
  - Frozen selection checkbox column on the left during horizontal scrolling.
  - Sticky footer aggregates (``tfoot``) pinned to the bottom.
* **Modern Form Views**:
  - Underline notebook tabs with badge pill counters.
  - Elevated metric stat buttons with hover lift animations.
* **Mobile Offcanvas Drawer (< 768px)**:
  - User profile tile with avatar, name, and active company badge.
  - Primary 1-tap **"All Apps / Dashboard"** jump button.
  - Touch-optimized nested submenu tree (``44px`` touch targets).

Configuration
=============

To customize company branding and wallpaper:

1. Navigate to **Settings > General Settings**.
2. Scroll to the **ANSIS Theme** section.
3. Upload custom company wallpaper or background images.
4. Save settings. Changes take effect across all active users in the company immediately.

Usage
=====

1. **Open Home Menu**: Click the brand icon or hover over the top-left app title to click the ``<`` back chevron.
2. **Search Apps**: Start typing anywhere in the Home Menu overlay to filter apps instantly.
3. **Reorder Apps**: Click and drag any app tile to a new position on the dashboard.
4. **Mobile Navigation**: On screens < 768px, tap the burger menu icon to open the slide-out drawer.

Known issues / Roadmap
======================

* Keyboard navigation (Arrow keys + Enter) in the Home Menu overlay.
* Deep-link URL sharing button in the navbar/systray with native Web Share API support.
* Collapsible kanban columns with compact vertical pill summaries.
* Stage header progress and distribution bars in kanban views.

Bug Tracker
===========

Bugs are tracked on `GitHub Issues <https://github.com/ansis-ai/ansis_web_theme/issues>`_.
In case of trouble, please check there if your issue has already been reported.

Credits
=======

Authors
~~~~~~~

* ANSIS Pte Ltd

Contributors
~~~~~~~~~~~~

* Wilson Loh <wilson@ansis.com.sg>
* ANSIS Pte Ltd <https://ansis.com.sg>

Maintainers
~~~~~~~~~~~

This module is maintained by `ANSIS Pte Ltd <https://ansis.com.sg>`_.
