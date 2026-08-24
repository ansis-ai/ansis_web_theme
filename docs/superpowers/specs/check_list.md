# check_list.md — ansis_web_theme Documentation Improvements

Pass/Fail checklist to run after executing all 5 tasks in the plan. Runs via the verifier script (`/tmp/ansis_doc_verify.py`) in Task 5, plus a small number of additional manual checks.

---

## Automated (26 assertions; exit 0 = pass)

| # | Check | Script label |
|---|---|---|
| 1 | README version badge is `Version-18.0.1.1.0-0284c7` | README bad version badge |
| 2 | README has "What's New in 18.0.1.1.0" heading | README missing What's New |
| 3 | README has §7 "Chatter & Dialog UX" heading | README no §7 Chatter UX section |
| 4 | README has §8 "Field Widget Enhancements" heading | README no §8 Field Widget section |
| 5 | README shows correct `-i ansis_web_theme` fresh-install command | README no fresh install -i command |
| 6 | README shows correct `-u ansis_web_theme` upgrade command | README no upgrade -u command |
| 7 | README post-install note references `post_init_hook=_setup_module` | README no post_init_hook sentence |
| 8 | README compliance table has the Hindsight row | README no Hindsight compliance row |
| 9 | USAGE.rst: section 1 exists (Home Menu) | USAGE missing section 1..5 individually |
| 10 | USAGE.rst: section 2 exists (List & Data Views) | same label loop |
| 11 | USAGE.rst: section 3 exists (Form Views & Mobile UX) | same label loop |
| 12 | USAGE.rst: section 4 exists (User Preferences Feature Guide) | same label loop |
| 13 | USAGE.rst: section 5 exists (6-step Walkthrough) | same label loop |
| 14 | USAGE.rst Keyboard Shortcuts table: has "Shortcut" and "Action" columns | USAGE no keyboard shortcuts table |
| 15 | USAGE.rst step 3 in 6-step walkthrough mentions Chatter Position Side / Bottom | USAGE missing 6-step walkthrough line re Chatter |
| 16 | CONFIGURE.rst: sections 1..6 ALL present individually | CONFIGURE missing section N (6 separate checks) |
| 17 | CONFIGURE.rst references `@api.constrains` explicitly | CONFIGURE no @api.constrains mention |
| 18 | CONFIGURE.rst has "Palette Round-Trip" sentence and mentions 18.0.1.1.0 | CONFIGURE no Palette Round-Trip fix note |
| 19 | CONFIGURE.rst uninstall section mentions `_uninstall_cleanup(env)` | CONFIGURE no uninstall hook paragraph |
| 20 | CONFIGURE.rst lists all 5 font families: Inter + Plus Jakarta Sans + Outfit (at minimum) | CONFIGURE no 5 font-family rows |
| 21 | DEVELOPER_APPENDIX.md heading §5.1 through §5.6 all present (6 separate assertions) | DEVELOPER_APPENDIX missing <name> |
| 22 | session_info key `chatter_position` documented | DEVELOPER_APPENDIX no session_info.chatter_position key |
| 23 | session_info key `dialog_size` documented | DEVELOPER_APPENDIX no session_info.dialog_size |
| 24 | session_info key `disable_quick_create` documented | DEVELOPER_APPENDIX no session_info.disable_quick_create |
| 25 | DEVELOPER_APPENDIX.md methods table references EXACTLY 12 method names | DEVELOPER_APPENDIX no method count — 12 rows present |
| 26 | No `sys.exit(1)` → overall script prints the green "✅ doc_verify.py: all <N> assertions passed" message | Implied by script exit code |

**Command to run:**
```bash
python3 /tmp/ansis_doc_verify.py
```
Written into Task 5.1 of the implementation plan with the full source.

---

## Manual (additional visual checks)

- [ ] **README.md rendered in a GitHub Flavored Markdown viewer** — 0 broken tables, no unmatched headings (top-level headings balance).
- [ ] **USAGE.rst rendered in docutils-compatible viewer** — keyboard table renders 9 rows (header + 8 data rows); no malformed grid-separator misalignment.
- [ ] **CONFIGURE.rst rendered:** Font Family table = 6 rows (header + 5 font options); Density table = 4 rows.
- [ ] **docs/DEVELOPER_APPENDIX.md tables method reference:** 13 rows (header + 12 methods); session_info table: 5 rows.
- [ ] **No Markdown leaked into RST files.** `readme/USAGE.rst` and `readme/CONFIGURE.rst` must not contain `[label](url)` Markdown link syntax; only RST links/roles. (The verifier script does not check for this; do a quick grep manually: `grep -nE '\[[^]]+\]\([^)]+\)' readme/USAGE.rst readme/CONFIGURE.rst` → 0 matches.)
- [ ] **No RST directives unknown to Odoo App Store.** `USAGE.rst` + `CONFIGURE.rst` use plain underlined titles and simple tables; no `.. image::` directives (screenshots are referenced only as parenthetical text placeholders; no directive).
- [ ] **No TODO / TBD / placeholder strings remain** in any of the four documents.
- [ ] **Backwards compat:** Original 15-line USAGE.rst and 7-line CONFIGURE.rst are overwritten, but the conceptual intro paragraph of each is preserved in the new expanded content.

---

## Total expected outcome

Automated: **26/26 assertions passed** (script exit 0) + Manual: **8/8 items checked off** = **PASS**
