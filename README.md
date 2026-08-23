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

**`ansis_web_theme`** brings enterprise-grade UX ergonomics, responsive mobile drawers, dynamic typography, brand color generation, and minimalist modern inputs to **Odoo 18.0 Community Edition** with **zero proprietary enterprise dependencies**.

Built with native **OWL 2** lifecycle patching and modular SCSS design tokens, it ensures 100% compatibility with standard Odoo community addons and minor point releases.

---

## ✨ Key Features

### 🚀 1. Core Navigation & Screen Real Estate
- **Brand Chevron Navigation (`<`)**: Displays the active app icon in the top navbar; transforms into an interactive `<` back chevron on hover to smoothly return to the Home Menu overlay.
- **Smart Overflow Submenus (`+` Dropdown)**: When an app has numerous top-level sections, excess menus automatically collapse into a clean `+` dropdown instead of wrapping onto an awkward second line.
- **100% Full-Width Screen Workspace**: Neutralizes redundant left sidebars (`AppsBar`) to reclaim 100% viewport width for data tables, form sheets, and chatter feeds.
- **Pinned Systray**: Anchored to the far right with floating pill notification badges and modern icon buttons (`36×36px`).

### 📱 2. Home Menu & Dashboard Overlay
- **Uniform App Grid**: Standardized tile dimensions (`104px × 124px`) with fixed 2-line centered labels for clean visual harmony.
- **Instant Client-Side Search**: Type anywhere upon opening the Home Menu to filter apps in real-time with autofocus and <kbd>ESC</kbd> clear.
- **Keyboard Navigation**: Full arrow key navigation (<kbd>←</kbd>, <kbd>→</kbd>, <kbd>↑</kbd>, <kbd>↓</kbd>), <kbd>Home</kbd>, <kbd>End</kbd>, and <kbd>Enter</kbd> to launch applications directly.
- **Drag-and-Drop Reordering**: Intuitive HTML5 drag-and-drop tile sorting with hybrid persistence (`localStorage` + `res.users.settings`).
- **Multi-Company Wallpapers**: Customizable company background wallpapers with crisp, sudo-safe asset streaming.

### 📊 3. Enhanced List & Data Views
- **Sticky Table Headers (`thead`)**: Pinned at `top: 0` with drop elevation shadow during vertical scrolling.
- **Frozen Left Checkboxes**: Selection column pinned during horizontal scrolling with vertical divider border.
- **Sticky Footer Totals (`tfoot`)**: Aggregate values pinned to `bottom: 0`.
- **Interactive Column Resizing & Optional Columns Selector**: Native drag handle resizing and right-frozen cog column picker.

### 📝 4. Modern Minimalist Form Views
- **1-Line Underline Input Fields**: Minimalist bottom-line inputs (`border-bottom: 1px solid #cbd5e1`) replacing bulky rounded input boxes. Focus state smoothly transitions to a 2px brand accent underline without box glow distortion.
- **Underline Notebook Tabs**: Clean flat tab navigation with sapphire accent underline (`border-bottom: 2px solid var(--ansis-primary)`), badge pills, and hover highlights.
- **Elevated Stat Buttons**: Metric cards with rounded icon boxes (`#f0f9ff`), bold metric numbers (`1rem` / `700`), and hover lift animations.
- **Mobile-Optimized Statusbar Pipeline**: Pill-style chevrons and consistent action button heights (`34px`).

### ⚙️ 5. Dedicated Application Settings & Font Customization
- **Dedicated "Theme & Branding" Tab**: Promoted to a top-level application settings section alongside Sales, Accounting, and Inventory.
- **Dynamic Typography Selector**: Choose between curated font stacks (*Inter*, *Plus Jakarta Sans*, *Roboto*, *Outfit*, and *System Default*) with instant CSS variable injection.
- **UI Layout Density Scaling**:
  - **Compact**: 32px table row height, tighter form padding for high-density workflows.
  - **Standard**: 40px balanced modern SaaS density.
  - **Comfortable**: 48px spacious enterprise layout.
- **Dynamic Brand Palette Generator**: Pick a brand accent color to automatically derive hover shades, light background tints (`--ansis-primary-light`), border accents, and focus rings in real-time.

### 📱 6. Mobile Offcanvas Sidebar (< 768px)
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

1. Navigate to **Settings > Theme & Branding**.
2. **Typography & Layout Density**:
   - Choose your **Font Family** (*Inter, Plus Jakarta Sans, Roboto, Outfit, System*).
   - Select **Base Font Scale** (Compact, Standard, Comfortable).
   - Adjust **UI Layout Density** (Compact / 32px rows, Standard / 40px rows, Comfortable / 48px rows).
3. **Brand Palette & Colors**:
   - Pick your **Primary Brand Accent** (e.g. Sapphire `#0284c7`, Royal Violet `#7c3aed`, Emerald `#059669`, Sunset Amber `#ea580c`).
4. **Company Wallpaper & Assets**:
   - Upload **Home Menu Wallpaper** and custom **Browser Favicon**.
5. Save settings. Changes take effect across all active users in the company immediately.

---

## 🛠️ Architecture & OCA Compliance

| Standard | Implementation |
| :--- | :--- |
| **OWL 2 Patching** | Uses `patch(NavBar.prototype, { ... })` and `patch(BurgerMenu.prototype, { ... })` without replacing core templates. |
| **Modular SCSS & Tokens** | Design tokens centralized in `:root` CSS variables (`--ansis-*`), enabling runtime customization without asset recompilation. |
| **Zero Core Modifications** | Strictly community-native logic and CSS without modifying Odoo core files. |
| **Linters & Tooling** | Configured with `.editorconfig` and `.pre-commit-config.yaml`. |

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for full project tracking:
- [x] Phase 0: Design System & Core Typography
- [x] Phase 1: Home Menu & Dashboard Enhancements
- [x] Phase 3: Navbar & Navigation Usability
- [x] Phase 4: List & Data Views Polish
- [x] Phase 6: Form Views & Mobile Interactions
- [x] Phase 7: Dedicated Theme Application Settings & Font Customization
- [ ] Phase 8: Consolidation of Muk Addon Dependencies (`muk_web_chatter`, `muk_web_dialog`, `muk_web_appsbar`, `muk_web_colors`)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development workflow.

---

## 👥 Credits & Attribution

* **Developer & Maintainer**: [ANSIS Pte Ltd](https://ansis.com.sg) (Wilson Loh <wilson@ansis.com.sg>)
* **Original Foundation**: This module is derived from and incorporates architectural concepts originally developed by [MuK IT GmbH & Co. KG](https://www.mukit.at) (Mathias Markl) licensed under LGPL-3.0.

---

## 📄 License

This module is licensed under the **GNU Lesser General Public License v3.0 (LGPL-3.0)**.

---

<div align="center">
  <b>Developed & Maintained by <a href="https://ansis.com.sg">ANSIS Pte Ltd</a></b>
</div>
