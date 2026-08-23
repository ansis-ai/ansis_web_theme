<div align="center">

# ANSIS Web Theme

**Modern Light SaaS Backend Theme for Odoo 18.0 Community Edition**

[![License: LGPL-3](https://img.shields.io/badge/License-LGPL--3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)
[![Odoo Version](https://img.shields.io/badge/Odoo-18.0-714B67.svg)](https://github.com/ansis-ai/ansis_web_theme)
[![Version](https://img.shields.io/badge/Version-18.0.1.0.0-0284c7.svg)](https://github.com/ansis-ai/ansis_web_theme)
[![Maintained by ANSIS](https://img.shields.io/badge/Maintained%20by-ANSIS%20Pte%20Ltd-0f172a.svg)](https://ansis.com.sg)

---

</div>

## 🌟 Overview

**`ansis_web_theme`** brings enterprise-grade UX ergonomics, responsive mobile drawers, modern typography, and clean data visualizations to **Odoo 18.0 Community Edition** with **zero proprietary enterprise dependencies**.

Built with native **OWL 2** lifecycle patching and modular SCSS, it ensures 100% compatibility with standard Odoo community addons and minor point releases.

---

## ✨ Key Features

### 🚀 1. Core Navigation & Layout
- **Brand Chevron Navigation (`<`)**: Displays active app icon in top navbar; transforms into an interactive `<` back chevron on hover to open the Home Menu overlay.
- **Smart Overflow Submenus (`+` Dropdown)**: When an app has numerous top-level menus, excess sections automatically collapse into a clean `+` dropdown instead of wrapping into a second line.
- **100% Full-Width Screen Workspace**: Neutralizes redundant left sidebars to maximize screen space for data tables, form sheets, and chatter panels.
- **Pinned Systray**: Firmly anchored to the far right with floating pill notification badges and modern icon buttons (`36×36px`).

### 📱 2. Home Menu & Dashboard Overlay
- **Uniform App Grid**: Standardized tile dimensions (`104px × 124px`) with fixed 2-line centered labels for consistent typography.
- **Instant Client-Side Search**: Start typing anywhere upon opening the Home Menu to filter apps in real-time with autofocus and <kbd>ESC</kbd> clear.
- **Drag-and-Drop Reordering**: Intuitive HTML5 drag-and-drop tile sorting with hybrid persistence (`localStorage` + `res.users.settings`).
- **Multi-Company Wallpapers**: Customizable company background images with frosted-glass backdrop blur (`16px`).

### 📊 3. Enhanced List & Data Views
- **Sticky Table Headers (`thead`)**: Pinned at `top: 0` with drop elevation shadow during vertical scrolling.
- **Frozen Left Checkboxes**: Selection column pinned during horizontal scrolling with vertical divider shadow.
- **Sticky Footer Totals (`tfoot`)**: Pinned at `bottom: 0` with top border shadow.
- **Interactive Column Resizing & Optional Columns Selector**: Native drag handle resizing and right-frozen cog selector.

### 📝 4. Modern Form Views
- **Underline Notebook Tabs**: Flat tab navigation with sapphire accent underline (`border-bottom: 2px solid #0284c7`), badge pills, and hover highlights.
- **Elevated Stat Buttons**: Metric cards with rounded icon boxes (`#f0f9ff`), bold metric numbers (`1rem` / `700`), and hover lift animations.
- **Mobile-Optimized Statusbar Pipeline**: Pill-style chevrons and consistent action button heights (`34px`).

### 📱 5. Mobile Offcanvas Sidebar (< 768px)
- **User Profile Header Tile**: Displays user avatar, name, and active company badge.
- **1-Tap All Apps Button**: Direct jump button to the fullscreen Home Menu overlay.
- **Touch-Friendly Submenus**: `44px` touch targets with indentation for nested menus.

---

## 📦 Installation

1. Clone or copy the module into your custom addons directory:
   ```bash
   cd /path/to/odoo/custom/addons
   git clone -b 18.0 https://github.com/ansis-ai/ansis_web_theme.git
   ```
2. Update your Odoo configuration file (`odoo.conf`):
   ```ini
   addons_path = /path/to/odoo/addons,/path/to/odoo/custom/addons
   ```
3. Update Apps list and install **ANSIS Web Theme** via Odoo Apps Store or CLI:
   ```bash
   odoo -u ansis_web_theme -d <database_name> --stop-after-init
   ```

---

## ⚙️ Configuration

1. Navigate to **Settings > General Settings**.
2. Scroll to the **ANSIS Theme** section.
3. Configure company wallpaper and theme options.
4. Save settings. Changes apply immediately.

---

## 🛠️ Architecture & OCA Compliance

| Standard | Implementation |
| :--- | :--- |
| **OWL 2 Patching** | Uses `patch(NavBar.prototype, { ... })` and `patch(BurgerMenu.prototype, { ... })` without replacing core templates. |
| **Modular SCSS** | Styles partitioned into `scss/colors.scss`, `webclient/navbar/`, `webclient/burger_menu/`, and `views/`. |
| **Community Native** | 100% LGPL-3 licensed with zero proprietary enterprise imports. |
| **Linters & Tooling** | Configured with `.editorconfig` and `.pre-commit-config.yaml`. |

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features:
- [ ] Keyboard navigation (<kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> + <kbd>Enter</kbd>) in Home Menu.
- [ ] Deep-link URL sharing button in systray with native Web Share API.
- [ ] Collapsible Kanban stages into compact vertical pills.
- [ ] Stage header progress and distribution bars in Kanban views.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development workflow.

---

## 👥 Credits & Attribution

* **Developer & Maintainer**: [ANSIS Pte Ltd](https://ansis.com.sg)
* **Original Foundation**: This module is derived from and incorporates architectural concepts originally developed by [MuK IT GmbH & Co. KG](https://www.mukit.at) (Mathias Markl) licensed under LGPL-3.0.

---

## 📄 License

This module is licensed under the **GNU Lesser General Public License v3.0 (LGPL-3.0)**.

---

<div align="center">
  <b>Developed & Maintained by <a href="https://ansis.com.sg">ANSIS Pte Ltd</a></b>
</div>
