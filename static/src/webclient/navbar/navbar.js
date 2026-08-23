/** @odoo-module **/
/*
    Copyright 2024-2026 ANSIS Pte Ltd
    License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
*/

import { NavBar } from "@web/webclient/navbar/navbar";
import { patch } from "@web/core/utils/patch";
import { onMounted, onPatched, onWillUnmount } from "@odoo/owl";
import { user } from "@web/core/user";
import { useService } from "@web/core/utils/hooks";

patch(NavBar.prototype, {
    setup() {
        super.setup();

        this.companyService = useService("company");

        if (this.state.isCustomHomeMenuOpen === undefined) {
            this.state.isCustomHomeMenuOpen = false;
        }

        this._onCustomHomeMenuKeydown = this.onCustomHomeMenuKeydown.bind(this);
        this._onGlobalClick = this.onGlobalClick.bind(this);
        this._onPopState = this.onPopState.bind(this);
        this._onRouteChange = this.onRouteChange.bind(this);

        onMounted(() => {
            this.renderCustomOverlay();
            this.bindBrandClick();
            document.addEventListener("keydown", this._onCustomHomeMenuKeydown);
            document.addEventListener("click", this._onGlobalClick, true);
            window.addEventListener("popstate", this._onPopState);
            this.env.bus?.addEventListener("ROUTE_CHANGE", this._onRouteChange);
            this.restoreCustomHomeMenuOnRefresh();
        });

        onPatched(() => {
            this.bindBrandClick();
        });

        onWillUnmount(() => {
            document.removeEventListener("keydown", this._onCustomHomeMenuKeydown);
            document.removeEventListener("click", this._onGlobalClick, true);
            window.removeEventListener("popstate", this._onPopState);
            this.env.bus?.removeEventListener("ROUTE_CHANGE", this._onRouteChange);
        });
    },

    toggleCustomHomeMenu() {
        if (this.state.isCustomHomeMenuOpen) {
            this.closeCustomHomeMenu();
        } else {
            this.openCustomHomeMenu();
        }
    },

    isHomeMenuHash() {
        const hash = window.location.hash;
        return !hash || hash === "" || hash === "#" || hash === "#home";
    },

    restoreCustomHomeMenuOnRefresh() {
        if (this.isHomeMenuHash()) {
            setTimeout(() => {
                this.state.isCustomHomeMenuOpen = true;
                document.body.classList.add("o_custom_home_menu_shown");
                this.renderCustomOverlay();
            }, 50);
        }
    },

    syncCustomHomeMenuWithUrl() {
        if (this.isHomeMenuHash()) {
            if (!this.state.isCustomHomeMenuOpen) {
                this.state.isCustomHomeMenuOpen = true;
                document.body.classList.add("o_custom_home_menu_shown");
                this.renderCustomOverlay();
            }
        } else if (this.state.isCustomHomeMenuOpen) {
            this.state.isCustomHomeMenuOpen = false;
            document.body.classList.remove("o_custom_home_menu_shown");
            this.renderCustomOverlay();
        }
    },

    onPopState() {
        this.syncCustomHomeMenuWithUrl();
    },

    onRouteChange() {
        this.syncCustomHomeMenuWithUrl();
        this.bindBrandClick();
    },

    openCustomHomeMenu() {
        this.state.isCustomHomeMenuOpen = true;
        document.body.classList.add("o_custom_home_menu_shown");
        this.renderCustomOverlay();
    },

    closeCustomHomeMenu(restoreUrl = true) {
        this.state.isCustomHomeMenuOpen = false;
        document.body.classList.remove("o_custom_home_menu_shown");
        this.renderCustomOverlay();
    },

    onCustomHomeMenuKeydown(ev) {
        if (!this.state.isCustomHomeMenuOpen) {
            return;
        }

        if (ev.key === "Escape") {
            ev.preventDefault();
            const input = document.getElementById("ansis_home_menu_search_input");
            if (input && input.value) {
                input.value = "";
                const event = new Event("input", { bubbles: true });
                input.dispatchEvent(event);
            } else {
                this.closeCustomHomeMenu(false);
            }
            return;
        }

        // Auto-focus search input when user starts typing alphanumeric characters
        const searchInput = document.getElementById("ansis_home_menu_search_input");
        if (
            searchInput &&
            document.activeElement !== searchInput &&
            !ev.ctrlKey &&
            !ev.metaKey &&
            !ev.altKey &&
            ev.key.length === 1
        ) {
            searchInput.focus();
        }
    },

    onGlobalClick(ev) {
        /* Intercept Brand Click (< Chevron) on Desktop */
        const brand = ev.target.closest('.o_menu_brand');
        if (brand) {
            ev.preventDefault();
            ev.stopPropagation();
            this.openCustomHomeMenu();
            return;
        }

        /* Intercept 'All Apps' inside mobile sidebar drawer */
        const allAppsBtn = ev.target.closest('.o_navbar_apps_menu button, [data-menu-xmlid], .o_apps_menu_button, .o_all_apps_btn, .o_menu_sections_toggle, .dropdown-item');
        
        if (allAppsBtn && (allAppsBtn.innerText.includes("All Apps") || allAppsBtn.querySelector('.fa-th, .oi-apps') || ev.target.classList.contains('oi-apps'))) {
            ev.preventDefault();
            ev.stopPropagation();

            /* Properly close Odoo 18 Bootstrap Offcanvas drawer */
            const offcanvasCloseBtn = document.querySelector('.offcanvas.show .btn-close');
            if (offcanvasCloseBtn) {
                offcanvasCloseBtn.click(); 
            } else {
                const activeDrawer = document.querySelector('.offcanvas.show, .o_navbar_mobile_sidebar.show, .o_burger_menu.show');
                if (activeDrawer) {
                    activeDrawer.classList.remove('show');
                }
                const backdrop = document.querySelector('.offcanvas-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                document.body.style.overflow = '';
            }

            this.openCustomHomeMenu();
        }
    },

    bindBrandClick() {
        const brand = document.querySelector(".o_menu_brand");
        if (brand) {
            const currentApp = this.menuService?.getCurrentApp();

            /* Ensure app name is present if DOM cleared it */
            if (currentApp && (!brand.innerText || brand.innerText.trim() === "")) {
                brand.innerText = currentApp.name;
            }

            if (currentApp) {
                const iconUrl = currentApp.webIconData
                    ? (currentApp.webIconData.startsWith('data:') || currentApp.webIconData.startsWith('/')
                        ? currentApp.webIconData
                        : `data:image/png;base64,${currentApp.webIconData}`)
                    : (currentApp.webIcon ? currentApp.webIcon.replace(',', '/') : '');
                
                if (iconUrl) {
                    let styleTag = document.getElementById("ansis_menu_brand_style");
                    if (!styleTag) {
                        styleTag = document.createElement("style");
                        styleTag.id = "ansis_menu_brand_style";
                        document.head.appendChild(styleTag);
                    }
                    styleTag.innerHTML = `@media (min-width: 769px) { .o_menu_brand::before { background-image: url('${iconUrl}') !important; } }`;
                }
            }

            brand.setAttribute('title', 'Main Menu');
            brand.setAttribute('aria-label', 'Main Menu');
            brand.style.cursor = 'pointer';
        }
    },

    getOrderedApps() {
        const apps = this.menuService.getApps();
        let savedOrder = null;
        try {
            const local = localStorage.getItem("ansis_apps_order");
            if (local) {
                savedOrder = JSON.parse(local);
            } else if (user?.settings?.homemenu_config) {
                savedOrder = JSON.parse(user.settings.homemenu_config);
            }
        } catch (e) {
            savedOrder = null;
        }

        if (!Array.isArray(savedOrder) || !savedOrder.length) {
            return apps;
        }

        const appMap = new Map();
        apps.forEach((app) => {
            appMap.set(app.id, app);
            if (app.xmlid) {
                appMap.set(app.xmlid, app);
            }
        });

        const ordered = [];
        savedOrder.forEach((key) => {
            if (appMap.has(key)) {
                const app = appMap.get(key);
                if (!ordered.includes(app)) {
                    ordered.push(app);
                }
            }
        });

        // Append any unindexed apps
        apps.forEach((app) => {
            if (!ordered.includes(app)) {
                ordered.push(app);
            }
        });

        return ordered;
    },

    saveAppOrder(order) {
        // 1. Instant local persistence
        try {
            localStorage.setItem("ansis_apps_order", JSON.stringify(order));
        } catch (e) {
            console.warn("Could not save app order to localStorage", e);
        }

        // 2. Background server persistence
        try {
            if (user && typeof user.setUserSettings === "function") {
                user.setUserSettings("homemenu_config", JSON.stringify(order)).catch((err) => {
                    console.warn("Could not sync app order to user settings", err);
                });
            }
        } catch (e) {
            console.warn("Could not sync app order to server", e);
        }

        // 3. Immediately trigger bus event so Sidebar (AppsBar) re-renders in sync
        this.env.bus?.trigger("MENUS:APP-CHANGED");
        this.env.bus?.trigger("HOMEMENU:REORDERED");
    },

    onAppClick(ev, app) {
        this.closeCustomHomeMenu(false);
        this.menuService.selectMenu(app);
        setTimeout(() => this.bindBrandClick(), 100);
    },

    renderCustomOverlay() {
        let overlayContainer = document.getElementById("ansis_home_menu_overlay_container");
        if (!overlayContainer) {
            overlayContainer = document.createElement("div");
            overlayContainer.id = "ansis_home_menu_overlay_container";
            document.body.appendChild(overlayContainer);
        }

        overlayContainer.innerHTML = "";
        if (this.state.isCustomHomeMenuOpen) {
            overlayContainer.innerHTML = this.renderOverlayHTML();
            this.attachOverlayEventListeners(overlayContainer);
        }
    },

    renderOverlayHTML() {
        const apps = this.getOrderedApps();
        const appCards = apps
            .map((app) => {
                const iconUrl = app.webIconData
                    ? (app.webIconData.startsWith('data:') || app.webIconData.startsWith('/')
                        ? app.webIconData
                        : `data:image/png;base64,${app.webIconData}`)
                    : (app.webIcon ? app.webIcon.replace(',', '/') : '');

                const iconHtml = iconUrl
                    ? `<img src="${iconUrl}" alt="${app.name}"/>`
                    : `<i class="oi oi-apps"></i>`;

                return `
                <a href="${this.getMenuItemHref(app)}"
                   class="ansis_home_menu_app_card custom_home_menu_app_card"
                   data-app-id="${app.id}"
                   data-app-xmlid="${app.xmlid || ''}"
                   data-app-name="${app.name.toLowerCase()}"
                   draggable="true">
                  <div class="ansis_home_menu_app_icon custom_home_menu_app_icon">
                    ${iconHtml}
                  </div>
                  <div class="ansis_home_menu_app_name custom_home_menu_app_name">${app.name}</div>
                </a>
            `;
            })
            .join("");

        const currentCompany = this.companyService?.currentCompany || this.env?.services?.company?.currentCompany;
        const hasWallpaper = Boolean(currentCompany?.has_background_image);
        const wallpaperUrl = hasWallpaper
            ? `/web/image/res.company/${currentCompany.id}/background_image`
            : "";
        const overlayStyle = wallpaperUrl ? `background-image: url('${wallpaperUrl}');` : "";
        const wallpaperClass = hasWallpaper ? "ansis_has_wallpaper" : "";

        return `
            <div class="ansis_home_menu_overlay custom_home_menu_overlay ${wallpaperClass}" style="${overlayStyle}">
              <div class="ansis_home_menu_backdrop"></div>
              <div class="ansis_home_menu_container custom_home_menu_container">
                <div class="ansis_home_menu_search_wrapper">
                  <div class="ansis_home_menu_search_box">
                    <i class="fa fa-search ansis_search_icon"></i>
                    <input type="text"
                           class="ansis_home_menu_search_input"
                           id="ansis_home_menu_search_input"
                           placeholder="Search apps..."
                           autocomplete="off"
                           spellcheck="false" />
                    <button type="button" class="ansis_search_clear_btn" id="ansis_search_clear_btn" style="display: none;">
                      <i class="fa fa-times-circle"></i>
                    </button>
                    <span class="ansis_search_kbd">ESC</span>
                  </div>
                </div>

                <div class="ansis_home_menu_grid custom_home_menu_grid" id="ansis_home_menu_grid">
                  ${appCards}
                </div>

                <div class="ansis_search_no_results" id="ansis_search_no_results" style="display: none;">
                  <div class="ansis_no_results_icon">
                    <i class="fa fa-search"></i>
                  </div>
                  <div class="ansis_no_results_title">No matching apps found</div>
                  <div class="ansis_no_results_subtitle">Press <kbd>ESC</kbd> to reset search</div>
                </div>
              </div>
            </div>
        `;
    },

    attachOverlayEventListeners(container) {
        const searchInput = container.querySelector("#ansis_home_menu_search_input");
        const clearBtn = container.querySelector("#ansis_search_clear_btn");
        const grid = container.querySelector("#ansis_home_menu_grid");
        const noResults = container.querySelector("#ansis_search_no_results");
        const appCards = container.querySelectorAll(".custom_home_menu_app_card, .ansis_home_menu_app_card");

        const filterApps = (query) => {
            const q = query.trim().toLowerCase();
            let matchCount = 0;
            let firstMatch = null;

            appCards.forEach((card) => {
                const name = card.dataset.appName || (card.querySelector(".ansis_home_menu_app_name")?.innerText || "").toLowerCase();
                const matches = !q || name.includes(q);
                card.style.display = matches ? "flex" : "none";
                if (matches) {
                    matchCount++;
                    if (!firstMatch) {
                        firstMatch = card;
                    }
                }
            });

            if (clearBtn) {
                clearBtn.style.display = q ? "block" : "none";
            }
            if (grid) {
                grid.style.display = matchCount > 0 ? "grid" : "none";
            }
            if (noResults) {
                noResults.style.display = matchCount === 0 ? "flex" : "none";
            }

            return firstMatch;
        };

        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 60);

            searchInput.addEventListener("input", (e) => {
                filterApps(e.target.value);
            });

            searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    const first = filterApps(searchInput.value);
                    if (first) {
                        first.click();
                    }
                }
            });
        }

        if (clearBtn && searchInput) {
            clearBtn.addEventListener("click", (e) => {
                e.preventDefault();
                searchInput.value = "";
                searchInput.focus();
                filterApps("");
            });
        }

        // --- Drag and Drop Logic (Option C: Hybrid Persistence) ---
        let draggedCard = null;
        let isDragging = false;

        appCards.forEach((card) => {
            card.addEventListener("dragstart", (e) => {
                // Do not drag if filtering
                if (searchInput && searchInput.value.trim().length > 0) {
                    e.preventDefault();
                    return;
                }
                draggedCard = card;
                isDragging = true;
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", card.dataset.appId);
                setTimeout(() => {
                    card.classList.add("ansis_dragging");
                }, 0);
            });

            card.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (draggedCard && card !== draggedCard) {
                    card.classList.add("ansis_drag_over");
                }
            });

            card.addEventListener("dragleave", () => {
                card.classList.remove("ansis_drag_over");
            });

            card.addEventListener("drop", (e) => {
                e.preventDefault();
                e.stopPropagation();
                card.classList.remove("ansis_drag_over");

                if (draggedCard && card !== draggedCard) {
                    const parent = grid;
                    const allCards = Array.from(parent.querySelectorAll(".ansis_home_menu_app_card"));
                    const fromIdx = allCards.indexOf(draggedCard);
                    const toIdx = allCards.indexOf(card);

                    if (fromIdx < toIdx) {
                        parent.insertBefore(draggedCard, card.nextSibling);
                    } else {
                        parent.insertBefore(draggedCard, card);
                    }

                    // Compute new app order array
                    const newOrder = Array.from(parent.querySelectorAll(".ansis_home_menu_app_card"))
                        .map((c) => c.dataset.appXmlid || parseInt(c.dataset.appId));

                    this.saveAppOrder(newOrder);
                }
            });

            card.addEventListener("dragend", () => {
                isDragging = false;
                if (draggedCard) {
                    draggedCard.classList.remove("ansis_dragging");
                    draggedCard = null;
                }
                container.querySelectorAll(".ansis_drag_over").forEach((c) => c.classList.remove("ansis_drag_over"));
            });

            // Normal click handler
            card.addEventListener("click", (e) => {
                if (isDragging) {
                    e.preventDefault();
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                const appId = parseInt(card.dataset.appId);
                const app = this.menuService.getApps().find((a) => a.id === appId);
                if (app) {
                    this.onAppClick(e, app);
                }
            });
        });
    }
});
