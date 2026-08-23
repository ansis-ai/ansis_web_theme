# ANSIS Web Theme - Modern Light UI/UX Roadmap (Odoo 18.0)

This roadmap documents the implementation progress, UX architecture, and planned features for **`ansis_web_theme`**, delivering a modern, clean, high-performance web client for Odoo 18.0 Community.

---

## 📌 Phase 0: Design System & Core Typography
*Status: `✅ Completed`*

- [x] **0.1 Modern Light Theme Foundation**
  - Crisp light palette (`#ffffff` surfaces, `#f8fafc` canvas, `#0284c7` primary sapphire accent).
  - Modern font smoothing, geometric typography hierarchy, and calibrated letter spacing (`-0.011em`).
- [x] **0.2 Floating Form Sheet & Control Panel Polish**
  - Pure white elevated `.o_form_sheet` card with multi-layer ambient drop shadows.
  - Modern `32px` input fields with sapphire focus glow rings (`0 0 0 3px rgba(2, 132, 199, 0.14)`).
  - Search view container with pill facet filter chips (`#f0f9ff` bg, `#bae6fd` border) and unified view switchers.
  - Soft warm amber styling (`#fffdf5`) for internal chatter log notes.
- [x] **0.3 Uniform Main Menu App Card Grid**
  - Standardized tile box dimensions (`104px × 124px`) with fixed `32px` 2-line centered label areas.
- [x] **0.4 100% Full-Width Screen Workspace**
  - Neutralized redundant left sidebar (`AppsBar`) to reclaim 100% viewport width for data tables, forms, and chatter panels.

---

## 📌 Phase 1: Home Menu & Dashboard Enhancements
*Reference: `web_enterprise/static/src/webclient/home_menu/`*

- [x] **1.1 Instant Search / Filter in Home Menu**
  - **Goal**: Allow users to start typing immediately upon opening the Home Menu to filter apps without opening the separate <kbd>Ctrl</kbd>+<kbd>K</kbd> modal.
  - **Status**: `✅ Completed`
  - **Details**: Floating search pill, autofocus on open, real-time client-side filter, clear button, and "No matching apps found" empty state.

- [x] **1.2 Keyboard Navigation**
  - **Goal**: Full keyboard usability in the Home Menu overlay.
  - **Status**: `✅ Completed`
  - **Features**:
    - Arrow Keys (<kbd>←</kbd>, <kbd>→</kbd>, <kbd>↑</kbd>, <kbd>↓</kbd>) dynamically calculate columns per row and move focus with a glowing sapphire outline (`.ansis_focused`).
    - <kbd>Home</kbd> / <kbd>End</kbd> to jump to the first / last app card.
    - <kbd>Enter</kbd> to launch the currently highlighted app card.
    - <kbd>Escape</kbd> to clear search or close overlay.
    - Type-ahead alphanumeric focus redirect with instant live filtering.

- [x] **1.3 Drag-and-Drop App Tile Reordering**
  - **Goal**: Allow users to customize their dashboard layout by dragging and dropping app tiles.
  - **Status**: `✅ Completed`
  - **Details**: HTML5 drag-and-drop with `.ansis_dragging` and `.ansis_drag_over` animations. Hybrid persistence (`localStorage` + `user.setUserSettings`).

- [x] **1.4 Company Wallpaper / Custom Background**
  - **Goal**: Customizable background wallpaper per company.
  - **Status**: `✅ Completed`
  - **Details**: Connected `res.company.background_image` to the Home Menu overlay with frosted-glass backdrop blur (`16px`) and multi-company support.

---

## 📌 Phase 2: Dark Mode & Color Scheme System
*Reference: `web_enterprise/static/src/webclient/color_scheme/`*

- [ ] **2.1 User Menu Color Scheme Switcher**
  - **Status**: `🚫 Reverted / Cancelled` (Preserved clean light SaaS design).

- [ ] **2.2 Dark Mode SCSS Asset Rules**
  - **Status**: `🚫 Reverted / Cancelled`.

---

## 📌 Phase 3: Navbar & Navigation Usability
*Reference: `web_enterprise/static/src/webclient/navbar/` & `share_url/`*

- [x] **3.1 Smart "More" Menu for Overflowing Submenus (`+` Dropdown)**
  - **Goal**: Automatically bundle excess menu items into a clean `+` dropdown instead of wrapping into a messy second line.
  - **Status**: `✅ Completed`
  - **Details**: Native Odoo 18 `web.NavBar.SectionsMenu.MoreDropdown` with dynamic section width calculation.

- [ ] **3.2 Deep-Link URL Share Action (`share_url`)**
  - **Goal**: Quick action to copy a clean direct link to the current record/action.
  - **Status**: `⏳ Planned`
  - **Features**:
    - Systray button to copy clean URL to clipboard with confirmation toast.
    - Mobile support for native Web Share API (`navigator.share`).

- [x] **3.3 Enhanced Mobile Offcanvas Sidebar**
  - **Goal**: Sleek slide-out navigation drawer for mobile devices (< 768px).
  - **Status**: `✅ Completed`
  - **Features**:
    - User profile tile with user avatar, name, and active company badge.
    - Quick **"All Apps / Dashboard"** primary button for 1-tap jump to the Home Menu overlay.
    - Touch-optimized nested submenu tree (`44px` targets) and user actions.

---

## 📌 Phase 4: List & Data Views Polish
*Reference: `web_enterprise/static/src/views/list/`*

- [x] **4.1 Sticky Table Headers & Freeze Columns**
  - **Goal**: Keep list view headers and key columns pinned during scrolling.
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

- [x] **4.3 Optional Columns Header Selector**
  - **Goal**: Quick cog/settings dropdown on the rightmost list header to toggle optional columns on/off.
  - **Status**: `✅ Completed`

---

## 📌 Phase 5: Kanban & Stage Workflow
*Reference: `web_enterprise/static/src/views/kanban/`*

- [ ] **5.1 Collapsible Kanban Columns**
  - **Goal**: Click on kanban column headers to fold/unfold stages into slim vertical pills with item count badges.
  - **Status**: `⏳ Planned`

- [ ] **5.2 Stage Header Progress Bars**
  - **Goal**: Progress and distribution bars on kanban stage headers reflecting record counts, values, or SLA statuses.
  - **Status**: `⏳ Planned`

---

## 📌 Phase 6: Form Views & Mobile Interactions
*Reference: `web_enterprise/static/src/core/notebook/` & `views/form/`*

- [x] **6.1 Modern Underline Notebook Tabs**
  - **Goal**: Clean flat tab navigation with accent underline bar (`border-bottom: 2px solid #0284c7`), badge pills, and smooth hover transitions.
  - **Status**: `✅ Completed`

- [x] **6.2 Elevated Stat Buttons (Button Box)**
  - **Goal**: Metric tiles styled with modern card elevation, rounded icon accent boxes (`#f0f9ff`), bold figures (`1rem` / `700`), and uppercase metadata labels.
  - **Status**: `✅ Completed`

- [x] **6.3 Sticky Mobile Action Bar & Statusbar Pipeline**
  - **Goal**: Clean statusbar container with pill-style stage chevrons (`.o_statusbar_status`) and consistent `34px` action buttons.
  - **Status**: `✅ Completed`

---

## 📌 Phase 7: Dedicated Theme Application Settings & Font Customization
*Reference: `res.config.settings` & `web.assets_backend`*

- [x] **7.1 Dedicated "Theme Settings" Application Section**
  - **Goal**: Decouple theme settings from *General Settings* and promote them to a standalone top-level Application Settings tab (alongside *Accounting*, *Website*, *Sales*, *Inventory*, *Moneta Finance*).
  - **Status**: `✅ Completed`
  - **Features**:
    - Dedicated left navigation tab: **"Theme & Branding"** (`<app name="ansis_web_theme">`) with official theme icon.
    - Organized setting blocks: **Typography & Fonts**, **Brand Palette & Colors**, **Company Wallpaper & Assets**.

- [x] **7.2 Dynamic Typography & Font Selection**
  - **Goal**: Allow administrators to configure backend fonts dynamically without editing SCSS source files.
  - **Status**: `✅ Completed`
  - **Features**:
    - **Font Family Selector**: Choose between curated modern font stacks:
      - *Inter* (Clean Modern SaaS default)
      - *Plus Jakarta Sans* (Sleek Geometric)
      - *Roboto* (Neutral Enterprise)
      - *Outfit* (Modern Round)
      - *Apple System / San Francisco* (Native OS)
    - **Base Font Scale**: Compact (`13px`), Standard (`14px`), Comfortable (`15px`).
    - Live CSS variable injection (`--ansis-font-sans`, `--ansis-font-size-base`).

- [x] **7.3 Brand Palette & UI Density Controls**
  - **Goal**: Configure primary brand colors, accent tints, and layout spacing.
  - **Status**: `✅ Completed`
  - **Features**:
    - Primary brand color picker with automatic dynamic generation of hover shade, soft pastel light tint, border accent, and focus glow rings.
    - UI Layout Density controls: Compact (32px rows), Standard (40px rows), Comfortable (48px rows) scaling list tables and form sheets.
    - Multi-company wallpaper and favicon streaming with zero ACL access errors.

---

## 📌 Phase 8: Consolidation of Muk Addon Dependencies into `ansis_web_theme`
*Goal: Eliminate external dependencies by natively integrating Muk addon features directly inside `ansis_web_theme` for clean, single-module deployment.*

- [x] **8.1 Chatter Architecture Integration (`muk_web_chatter`)** `[Status: ✅ Completed]`
  - **Models & Session**: Added `chatter_position` Selection field (`side` / `bottom`) to `res.users` and serialized into `session_info.chatter_position`.
  - **User Preferences Form**: Added `views/res_users.xml` exposing Chatter Position settings under user profile.
  - **Dynamic Compiler & Renderer**: Patched OWL `FormCompiler` and `FormRenderer` to handle split-screen side/bottom positioning, horizontal drag-to-resize, width persistence, and double-click reset.
  - **Notification Filter Toggle**: Added eye icon toggle button in `Chatter` to filter out automated notification messages on demand.
  - **Dependency Decoupling**: Replaced `muk_web_chatter` dependency with standard `mail` module.
- [x] **8.2 Draggable & Resizable Dialogs (`muk_web_dialog`)** `[Status: ✅ Completed]`
  - **Models & Session**: Added `dialog_size` Selection field (`minimize` / `maximize`) on `res.users` and serialized into `session_info.dialog_size`.
  - **User Preferences Form**: Added Dialog Size preference setting to user form view (`views/res_users.xml`).
  - **Dynamic Maximize/Restore Toggle**: Patched OWL `Dialog` and `SelectCreateDialog` with size state management and added header maximize/compress toggle button.
  - **Modern Dialog Aesthetics**: Added fullscreen modal mode (`.modal-fs`), smooth transition curves, elevated shadow layers, and custom control buttons (`.ansis_btn_dialog_size`).
  - **Dependency Decoupling**: Completely eliminated `muk_web_dialog` dependency.
- [x] **8.3 Navigation & AppsBar Clean Architecture (`muk_web_appsbar`)** `[Status: ✅ Completed]`
  - **Models & Session**: Added `appbar_image` Binary on `res.company` / `res.config.settings`, `sidebar_type` Selection (`invisible` / `small` / `large`) on `res.users`, and serialized `has_appsbar_image` and `sidebar_type` into `session_info`.
  - **User & Company Views**: Exposed Sidebar Type layout preference under user profile and Apps Sidebar Footer Logo upload under Theme & Branding settings.
  - **OWL AppsBar & Menu Service**: Implemented native `appMenuService` and `AppsBar` component with event bus listeners for active app synchronization.
  - **Modern Sidebar Styling & Grid Layout**: Implemented CSS grid layout in `WebClient` supporting full-width, compact icon strip (52px), and full labeled sidebar (180px) with zero layout shift and automatic mobile breakpoint collapsing.
  - **Dependency Decoupling**: Completely eliminated `muk_web_appsbar` dependency.
- [ ] **8.4 Theme Color Engine & Asset Utilities (`muk_web_colors` / `muk_web_utils`)**
  - Native SCSS color asset compiler and web editor asset reset tools.

---

## 🛠️ Architecture & Compatibility Guidelines

1. **Avoid Strict OWL Component Overrides**:
   - Prefer patching class prototype methods and hooks (`patch(NavBar.prototype, { ... })`) over replacing base component tags in XML to avoid breaking across minor Odoo 18 point releases.
2. **Modular SCSS & CSS Variables**:
   - Centralize design tokens via CSS custom properties (`--ansis-*`) on `:root` to allow runtime settings updates without full asset recompilation.
3. **Zero Enterprise License Conflicts**:
   - Implement clean community-native logic and CSS that mimics enterprise ergonomics under **LGPL-3.0**.
