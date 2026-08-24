=====
Usage
=====

This module is fully functional after install with sane defaults. No additional server configuration is required. The features below are purely optional and driven by user or admin preferences.

1. Home Menu & Dashboard Navigation
===================================

(screenshot: static/description/usage_home_menu.png — home menu overlay with search + drag-drop grid)

Click the ANSIS logo or the ``<`` chevron at the top-left of the left navigation to open the *Home Menu* overlay. The overlay shows your enabled apps as a large icon grid with built-in search.

Keyboard Shortcuts
------------------

+----------------------------------+--------------------------------------------------------------------------------+
| Shortcut                         | Action                                                                         |
+==================================+================================================================================+
| Hover brand icon / ``<`` chevron | Return to Home Menu overlay                                                    |
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
| Drag & drop app cards            | Reorder your dashboard. Persisted via ``localStorage`` + ``res.users.settings``|
+----------------------------------+--------------------------------------------------------------------------------+

2. List & Data Views
====================

- **Sticky thead:** Column headers stay pinned to the top of the window during vertical scroll so you never lose context of which column you are editing.
- **Frozen-left selection checkbox:** During wide-table horizontal scroll, the checkbox column remains pinned so row selection stays accessible.
- **Sticky tfoot aggregates / totals:** Summary rows stick to the bottom of the list view during scroll.
- **Optional Columns cog + column resizer:** Drag column edges to resize; click the gear icon on the rightmost header to toggle column visibility.

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
- Eye-icon toggle inside chatter: click the eye icon in the chatter header to hide automated notification messages so only human chatter, comments, and tracked-changes are visible. Click again to show everything.

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
================================================================

1. Click the avatar in the top-right corner of the window to open the user menu.
2. Select **My Profile**.
3. Open the **Preferences** tab (the third tab, after Internal User Preferences / Access Rights / Preferences depending on your user type).
4. Set **Chatter Position** to either Side or Bottom.
5. Set **Dialog Size** to Minimize or Maximize. Set **Sidebar Type** to match your mobile drawer preference.
6. Click **Save** at the bottom of the form. The new preferences take effect on the next page reload (automatic after save in Odoo 18).
