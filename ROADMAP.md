# ANSIS Web Theme — Feature & Enhancement Roadmap

This roadmap documents all theme enhancements, UI/UX polish, and architectural features for **`ansis_web_theme`** (Odoo 18.0 Community), referencing enterprise ergonomics from **`web_enterprise`**.

---

## 📊 Quick Status Overview

| Item | Feature Name | Status | Milestone / Phase |
| :--- | :--- | :---: | :--- |
| **0.1** | **Back Chevron Navigation (`<`)** | `✅ Completed` | Core Navigation |
| **0.2** | **Modern Light SaaS Theme Palette** | `✅ Completed` | Core Styling |
| **0.3** | **Uniform App Card Sizing (`104×124px`)** | `✅ Completed` | Dashboard Layout |
| **0.4** | **Full-Width Screen Workspace (No Sidebar)** | `✅ Completed` | Screen Optimization |
| **1.1** | **Instant Search / Filter in Home Menu** | `✅ Completed` | Phase 1: Home Menu |
| **1.2** | **Keyboard Navigation (Arrows, Enter, Esc)** | `⏳ Planned` | Phase 1: Home Menu |
| **1.3** | **Drag-and-Drop App Tile Reordering** | `✅ Completed` | Phase 1: Home Menu |
| **1.4** | **Company Wallpaper / Custom Background** | `✅ Completed` | Phase 1: Home Menu |
| **2.1** | **User Menu Color Scheme Switcher** | `🚫 Reverted` | Phase 2: Dark Mode |
| **2.2** | **Dark Mode SCSS Asset Rules** | `🚫 Reverted` | Phase 2: Dark Mode |
| **3.1** | **Smart "More" Menu for Overflowing Submenus (`+` Dropdown)** | `✅ Completed` | Phase 3: Navbar |
| **3.2** | **Deep-Link URL Share Action (`share_url`)** | `⏳ Planned` | Phase 3: Navbar |
| **3.3** | **Enhanced Mobile Offcanvas Sidebar** | `✅ Completed` | Phase 3: Navbar |
| **4.1** | **Sticky Table Headers & Freeze Columns** | `✅ Completed` | Phase 4: Data Views |
| **4.2** | **Interactive Column Resizing** | `✅ Completed` | Phase 4: Data Views |
| **4.3** | **Optional Columns Header Selector** | `✅ Completed` | Phase 4: Data Views |
| **5.1** | **Collapsible Kanban Columns** | `⏳ Planned` | Phase 5: Kanban |
| **5.2** | **Stage Header Progress Bars** | `⏳ Planned` | Phase 5: Kanban |
| **6.1** | **Modern Underline Notebook Tabs** | `✅ Completed` | Phase 6: Forms |
| **6.2** | **Elevated Stat Buttons (Button Box)** | `✅ Completed` | Phase 6: Forms |
| **6.3** | **Sticky Mobile Action Bar & Pipeline** | `✅ Completed` | Phase 6: Forms |

---

## 🚀 Core Foundation (Completed)

- [x] **0.1 Back Chevron Navigation (`<`)**
  - Displays active app icon on `.o_menu_brand::before`.
  - Replaces icon with `<` back chevron on hover to return to the Home Menu overlay.
  - Intercepts brand click in capture phase to reliably open Home Menu across all views.
  - Hides legacy 9-boxes grid icon on desktop (`> 768px`).

- [x] **0.2 Modern Light SaaS Theme Palette**
  - Primary sapphire blue (`#0284c7`) brand color.
  - Clean `#ffffff` cards and sheets against soft `#f8fafc` canvas.
  - Slate typography (`#0f172a` / `#1e293b` / `#475569`).
  - Crisp `#e2e8f0` borders and subtle elevation shadows.

- [x] **0.3 Uniform Main Menu App Card Grid**
  - Standardized tile box dimensions (`104px × 124px`) with fixed `32px` 2-line centered label areas.
  - Perfect alignment regardless of app name length (*Discuss* vs *Moneta Finance*).

- [x] **0.4 100% Full-Width Screen Workspace**
  - Neutralized redundant left sidebar (`AppsBar`) to reclaim 100% viewport width for data tables, forms, and chatter panels.

---

## 📌 Phase 1: Home Menu & Dashboard Enhancements
*Reference: `web_enterprise/static/src/webclient/home_menu/`*

- [x] **1.1 Instant Search / Filter in Home Menu**
  - **Goal**: Allow users to start typing immediately upon opening the Home Menu to filter apps without opening the separate <kbd>Ctrl</kbd>+<kbd>K</kbd> modal.
  - **Status**: `✅ Completed`
  - **Details**: Floating search pill, autofocus on open, real-time client-side filter, clear button, and "No matching apps found" empty state.

- [ ] **1.2 Keyboard Navigation**
  - **Goal**: Full keyboard usability in the Home Menu overlay.
  - **Status**: `⏳ Planned`
  - **Keys**:
    - Arrow Keys (<kbd>←</kbd>, <kbd>→</kbd>, <kbd>↑</kbd>, <kbd>↓</kbd>) to highlight app cards.
    - <kbd>Enter</kbd> to launch the selected app.
    - <kbd>Escape</kbd> to close overlay and return to the previous view.

- [x] **1.3 Drag-and-Drop App Tile Reordering**
  - **Goal**: Allow users to customize their dashboard layout by dragging and dropping app tiles.
  - **Status**: `✅ Completed`
  - **Details**: HTML5 drag-and-drop with `.ansis_dragging` and `.ansis_drag_over` animations. Option C Hybrid persistence (`localStorage` + `user.setUserSettings`).

- [x] **1.4 Company Wallpaper / Custom Background**
  - **Goal**: Customizable background wallpaper per company.
  - **Status**: `✅ Completed`
  - **Details**: Connected `res.company.background_image` to the Home Menu overlay with frosted-glass backdrop blur (`16px`) and multi-company support.

---

## 📌 Phase 2: Dark Mode & Color Scheme System
*Reference: `web_enterprise/static/src/webclient/color_scheme/`*

- [ ] **2.1 User Menu Color Scheme Switcher**
  - **Goal**: Add a one-click theme switcher in the user systray dropdown.
  - **Status**: `🚫 Reverted / Cancelled`
  - **Details**: Reverted upon user preference in favor of clean, consistent Modern Light SaaS design.

- [ ] **2.2 Dark Mode SCSS Asset Rules**
  - **Goal**: Comprehensive dark theme styling across all Odoo views.
  - **Status**: `🚫 Reverted / Cancelled`
  - **Details**: Reverted and removed to keep stylesheets lean and focused on pristine light UX.

---

## 📌 Phase 3: Navbar & Navigation Usability
*Reference: `web_enterprise/static/src/webclient/navbar/` & `share_url/`*

- [x] **3.1 Smart "More" Menu for Overflowing Submenus (`+` Dropdown)**
  - **Goal**: When an app has numerous top-level menu sections (e.g. Accounting, Inventory, Manufacturing) that exceed screen width, automatically bundle excess items into a clean `+` dropdown instead of wrapping into a messy second line.
  - **Status**: `✅ Completed`
  - **Details**: Built natively into Odoo 18 (`web.NavBar.SectionsMenu.MoreDropdown`) with dynamic section width calculation and the `+` (`fa-plus`) action button.

- [ ] **3.2 Deep-Link URL Share Action (`share_url`)**
  - **Goal**: Quick action to copy a clean direct link to the current record/action.
  - **Status**: `⏳ Planned`
  - **Features**:
    - Systray/navbar button to copy clean URL to clipboard with confirmation toast.
    - Mobile support for native Web Share API (`navigator.share`).
  - **Reference**: `web_enterprise/static/src/webclient/share_url/`

- [x] **3.3 Enhanced Mobile Offcanvas Sidebar**
  - **Goal**: Sleek slide-out navigation drawer for mobile devices (< 768px).
  - **Status**: `✅ Completed`
  - **Features**:
    - Clean user profile tile with user avatar, name, and active company badge.
    - Quick **"All Apps / Dashboard"** primary button for 1-tap jump to the Home Menu overlay.
    - Multi-company switcher card styling.
    - Touch-optimized nested submenu tree (`44px` targets) and user actions.

---

## 📌 Phase 4: List & Data Views Polish
*Reference: `web_enterprise/static/src/views/list/`*

- [x] **4.1 Sticky Table Headers & Freeze Columns**
  - **Goal**: Keep list view headers and key columns pinned during scrolling so records remain identifiable in large datasets.
  - **Status**: `✅ Completed`
  - **Features**:
    - Sticky `thead` positioning with drop shadow elevation (`box-shadow: 0 4px 6px -2px rgba(15, 23, 42, 0.05)`).
    - Frozen selection checkbox column (`.o_list_record_selector`) pinned during horizontal scroll.
    - Frozen right actions column (`.o_list_controller`, `.o_list_button`).
    - Sticky `tfoot` totals and aggregates bar at `bottom: 0`.
    - Sticky grouped headers (`.o_group_header`).

- [x] **4.2 Interactive Column Resizing**
  - **Goal**: Drag column borders on desktop to resize table columns.
  - **Status**: `✅ Completed`
  - **Features**: Powered natively in Odoo 18 via `column_width_hook.js` & `.o_resize` grab handles, fully integrated with sticky table headers and frozen columns in [list.scss](file:///Users/wsloh/perfectwork/PW_ADDONS.18.0/moneta_finance/ansis_web_theme/static/src/views/list/list.scss).

- [x] **4.3 Optional Columns Header Selector**
  - **Goal**: Quick cog/settings dropdown on the rightmost list header to toggle optional columns on/off.
  - **Status**: `✅ Completed`
  - **Features**: Integrated with right-frozen `th.o_list_controller` and styled with modern dropdown shadows and hover highlights in [list.scss](file:///Users/wsloh/perfectwork/PW_ADDONS.18.0/moneta_finance/ansis_web_theme/static/src/views/list/list.scss).

---

## 📌 Phase 5: Kanban & Stage Workflow
*Reference: `web_enterprise/static/src/views/kanban/`*

- [ ] **5.1 Collapsible Kanban Columns**
  - **Goal**: Click on kanban column headers to fold/unfold stages.
  - **Status**: `⏳ Planned`
  - **Features**:
    - Folded columns collapse into slim vertical pills with item count badges, saving horizontal screen real estate.
    - Smooth animation on column collapse/expand.

- [ ] **5.2 Stage Header Progress Bars**
  - **Goal**: Progress and distribution bars on kanban stage headers reflecting record counts, values, or SLA statuses.
  - **Status**: `⏳ Planned`

---

## 📌 Phase 6: Form Views & Mobile Interactions
*Reference: `web_enterprise/static/src/core/notebook/` & `views/form/`*

- [x] **6.1 Modern Underline Notebook Tabs**
  - **Goal**: Clean flat tab navigation with accent underline bar (`border-bottom: 2px solid #0284c7`), badge pills, vertical tab support, and hover transitions instead of boxy buttons.
  - **Status**: `✅ Completed`

- [x] **6.2 Elevated Stat Buttons (Button Box)**
  - **Goal**: Top-right metric tiles in form views styled with modern card elevation, rounded icon accent boxes (`#f0f9ff`), bold metric figures (`1rem` / `700`), uppercase metadata labels, and hover lift animations.
  - **Status**: `✅ Completed`

- [x] **6.3 Sticky Mobile Action Bar & Statusbar Pipeline**
  - **Goal**: Clean statusbar container with pill-style stage chevrons (`.o_statusbar_status`), primary/secondary action buttons with consistent height (`34px`), and responsive thumb-friendly mobile layouts (`< 768px`).
  - **Status**: `✅ Completed`

---

## 🛠️ Architecture & Compatibility Guidelines

1. **Avoid Strict OWL Component Overrides**:
   - Prefer patching class prototype methods and hooks (`patch(NavBar.prototype, { ... })`) over replacing base component tags in XML to avoid breaking across minor Odoo 18 point releases.
2. **Modular SCSS**:
   - Organize stylesheets logically under `static/src/scss/`, `static/src/webclient/`, and `static/src/views/`.
   - Maintain clean light defaults with CSS custom properties (`var(--...)`) for seamless dark mode switching.
3. **Zero Enterprise License Conflicts**:
   - Implement clean community-native logic and CSS that mimics enterprise ergonomics without importing proprietary Python code.
