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

        this.focusedAppIndex = 0;
        this._onCustomHomeMenuKeydown = this.onCustomHomeMenuKeydown.bind(this);
        this._onPopState = this.onPopState.bind(this);
        this._onRouteChange = this.onRouteChange.bind(this);

        this._onDocumentClick = (ev) => {
            const toggle = ev.target.closest(
                ".o_menu_brand, .o_navbar_apps_menu button, .mk_app_menu button, button[data-hotkey='h'], .o_menu_toggle"
            );
            if (toggle && !this.state.isCustomHomeMenuOpen) {
                // If it's a submenu dropdown or entry inside .o_menu_sections, ignore unless it is the brand tile
                if (toggle.closest(".o_menu_sections") && !toggle.classList.contains("o_menu_brand")) {
                    return;
                }
                ev.preventDefault();
                ev.stopPropagation();
                this.openCustomHomeMenu();
            }
        };

        onMounted(() => {
            this.renderCustomOverlay();
            this.bindBrandClick();
            document.addEventListener("click", this._onDocumentClick);
            document.addEventListener("keydown", this._onCustomHomeMenuKeydown);
            window.addEventListener("popstate", this._onPopState);
            this.env.bus?.addEventListener("ROUTE_CHANGE", this._onRouteChange);
            this.restoreCustomHomeMenuOnRefresh();
        });

        onPatched(() => {
            this.bindBrandClick();
        });

        onWillUnmount(() => {
            document.removeEventListener("click", this._onDocumentClick);
            document.removeEventListener("keydown", this._onCustomHomeMenuKeydown);
            window.removeEventListener("popstate", this._onPopState);
            this.env.bus?.removeEventListener("ROUTE_CHANGE", this._onRouteChange);
        });
    },

    onNavBarDropdownItemSelection(menu) {
        if (menu && this.currentApp && menu.id === this.currentApp.id) {
            this.openCustomHomeMenu();
            return;
        }
        super.onNavBarDropdownItemSelection(menu);
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
        this.focusedAppIndex = 0;
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

        const overlayContainer = document.getElementById("ansis_home_menu_overlay_container");
        if (!overlayContainer) return;

        const searchInput = overlayContainer.querySelector("#ansis_home_menu_search_input");
        const allCards = Array.from(overlayContainer.querySelectorAll(".custom_home_menu_app_card, .ansis_home_menu_app_card"));
        const visibleCards = allCards.filter((card) => card.style.display !== "none");

        const getColumnsPerRow = () => {
            if (visibleCards.length <= 1) return 1;
            const firstTop = visibleCards[0].offsetTop;
            let cols = 0;
            for (let i = 0; i < visibleCards.length; i++) {
                if (Math.abs(visibleCards[i].offsetTop - firstTop) < 10) {
                    cols++;
                } else {
                    break;
                }
            }
            return cols || 1;
        };

        const setFocus = (idx) => {
            if (!visibleCards.length) return;
            this.focusedAppIndex = Math.max(0, Math.min(idx, visibleCards.length - 1));
            allCards.forEach((c) => c.classList.remove("ansis_focused"));
            const target = visibleCards[this.focusedAppIndex];
            if (target) {
                target.classList.add("ansis_focused");
                target.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        };

        // 1. ESCAPE
        if (ev.key === "Escape") {
            ev.preventDefault();
            if (searchInput && searchInput.value) {
                searchInput.value = "";
                const event = new Event("input", { bubbles: true });
                searchInput.dispatchEvent(event);
            } else {
                this.closeCustomHomeMenu(false);
            }
            return;
        }

        // 2. ENTER
        if (ev.key === "Enter") {
            ev.preventDefault();
            if (visibleCards.length && visibleCards[this.focusedAppIndex]) {
                visibleCards[this.focusedAppIndex].click();
            }
            return;
        }

        // 3. ARROW KEYS
        if (ev.key === "ArrowRight") {
            ev.preventDefault();
            setFocus((this.focusedAppIndex + 1) % visibleCards.length);
            return;
        }

        if (ev.key === "ArrowLeft") {
            ev.preventDefault();
            setFocus((this.focusedAppIndex - 1 + visibleCards.length) % visibleCards.length);
            return;
        }

        if (ev.key === "ArrowDown") {
            ev.preventDefault();
            const cols = getColumnsPerRow();
            const nextIdx = this.focusedAppIndex + cols;
            if (nextIdx < visibleCards.length) {
                setFocus(nextIdx);
            }
            return;
        }

        if (ev.key === "ArrowUp") {
            ev.preventDefault();
            const cols = getColumnsPerRow();
            const prevIdx = this.focusedAppIndex - cols;
            if (prevIdx >= 0) {
                setFocus(prevIdx);
            } else if (searchInput) {
                searchInput.focus();
            }
            return;
        }

        if (ev.key === "Home") {
            ev.preventDefault();
            setFocus(0);
            return;
        }

        if (ev.key === "End") {
            ev.preventDefault();
            setFocus(visibleCards.length - 1);
            return;
        }

        // Auto-focus search input when user starts typing regular characters
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

    bindBrandClick() {
        const brand = document.querySelector(".o_menu_brand");
        if (brand) {
            const currentApp = this.menuService?.getCurrentApp();

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

        // 3. Trigger bus event
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
            .map((app, index) => {
                const iconUrl = app.webIconData
                    ? (app.webIconData.startsWith('data:') || app.webIconData.startsWith('/')
                        ? app.webIconData
                        : `data:image/png;base64,${app.webIconData}`)
                    : (app.webIcon ? app.webIcon.replace(',', '/') : '');

                const iconHtml = iconUrl
                    ? `<img src="${iconUrl}" alt="${app.name}"/>`
                    : `<i class="oi oi-apps"></i>`;

                const isFirst = index === 0 ? "ansis_focused" : "";

                return `
                <a href="${this.getMenuItemHref(app)}"
                   class="ansis_home_menu_app_card custom_home_menu_app_card ${isFirst}"
                   data-app-id="${app.id}"
                   data-app-xmlid="${app.xmlid || ''}"
                   data-app-name="${app.name.toLowerCase()}"
                   data-index="${index}"
                   tabindex="0"
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

        return `
            <div class="ansis_home_menu_overlay custom_home_menu_overlay ${hasWallpaper ? 'has_wallpaper' : ''}">
                ${hasWallpaper ? `<div class="ansis_home_menu_bg" style="background-image: url('${wallpaperUrl}');"></div>` : ''}
                
                <div class="ansis_home_menu_search_container">
                    <div class="ansis_home_menu_search_box">
                        <i class="oi oi-search ansis_search_icon"></i>
                        <input type="text"
                               id="ansis_home_menu_search_input"
                               placeholder="Search apps and menus..."
                               autocomplete="off"
                               spellcheck="false"/>
                        <button type="button" id="ansis_home_menu_search_clear" class="ansis_search_clear" style="display: none;">
                            <i class="oi oi-close"></i>
                        </button>
                    </div>
                </div>

                <div class="ansis_home_menu_grid custom_home_menu_grid">
                    ${appCards}
                </div>
            </div>
        `;
    },

    attachOverlayEventListeners(container) {
        const searchInput = container.querySelector("#ansis_home_menu_search_input");
        const clearBtn = container.querySelector("#ansis_home_menu_search_clear");
        const grid = container.querySelector(".ansis_home_menu_grid");
        const appCards = Array.from(container.querySelectorAll(".ansis_home_menu_app_card"));

        // Auto focus search input on desktop
        if (searchInput && window.innerWidth > 768) {
            setTimeout(() => searchInput.focus(), 80);
        }

        // --- Live Search Logic ---
        if (searchInput) {
            const filterApps = () => {
                const query = searchInput.value.trim().toLowerCase();
                let matchCount = 0;
                let firstMatch = null;

                if (clearBtn) {
                    clearBtn.style.display = query.length > 0 ? "flex" : "none";
                }

                appCards.forEach((card) => {
                    const name = card.dataset.appName || (card.querySelector(".ansis_home_menu_app_name")?.innerText || "").toLowerCase();
                    const matches = query === "" || name.includes(query);
                    card.style.display = matches ? "flex" : "none";
                    if (matches) {
                        matchCount++;
                        if (!firstMatch) {
                            firstMatch = card;
                        }
                    }
                });

                // Update focused card on search filter
                appCards.forEach((c) => c.classList.remove("ansis_focused"));
                if (firstMatch) {
                    firstMatch.classList.add("ansis_focused");
                    this.focusedAppIndex = 0;
                }

                let noResults = container.querySelector(".ansis_home_menu_no_results");
                if (matchCount === 0) {
                    if (!noResults) {
                        noResults = document.createElement("div");
                        noResults.className = "ansis_home_menu_no_results";
                        noResults.innerHTML = `
                            <div class="ansis_no_results_icon"><i class="oi oi-search"></i></div>
                            <div class="ansis_no_results_text">No applications found matching "<strong>${query}</strong>"</div>
                        `;
                        grid.appendChild(noResults);
                    } else {
                        noResults.querySelector("strong").innerText = query;
                        noResults.style.display = "flex";
                    }
                } else if (noResults) {
                    noResults.style.display = "none";
                }
            };

            searchInput.addEventListener("input", filterApps);

            if (clearBtn) {
                clearBtn.addEventListener("click", () => {
                    searchInput.value = "";
                    filterApps();
                    searchInput.focus();
                });
            }
        }

        // --- Mouse Hover & Focus Sync ---
        appCards.forEach((card) => {
            card.addEventListener("mouseenter", () => {
                const visible = appCards.filter((c) => c.style.display !== "none");
                const vIdx = visible.indexOf(card);
                if (vIdx !== -1) {
                    this.focusedAppIndex = vIdx;
                    appCards.forEach((c) => c.classList.remove("ansis_focused"));
                    card.classList.add("ansis_focused");
                }
            });
        });

        // --- Drag and Drop Logic (Option C: Hybrid Persistence) ---
        let draggedCard = null;
        let isDragging = false;

        appCards.forEach((card) => {
            card.addEventListener("dragstart", (e) => {
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
                    const allCurrent = Array.from(parent.querySelectorAll(".ansis_home_menu_app_card"));
                    const fromIdx = allCurrent.indexOf(draggedCard);
                    const toIdx = allCurrent.indexOf(card);

                    if (fromIdx < toIdx) {
                        parent.insertBefore(draggedCard, card.nextSibling);
                    } else {
                        parent.insertBefore(draggedCard, card);
                    }

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
