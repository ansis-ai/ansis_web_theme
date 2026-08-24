# tasks.md — ansis_web_theme Documentation Improvements (2026-08-24)

All tasks derive from the implementation plan at:
`docs/superpowers/plans/2026-08-24-ansis-web-theme-documentation-improvements.md`

| # | Task Title | Files touched | Estimated new lines | Estimated changed lines | Independent? |
|---|---|---|---:|---:|---|
| T1 | README.md edits — badge, What's New, Key Features §7+§8, Installation commands, Compliance rows | `README.md` | ~40 | ~20 | **YES** — standalone, no cross-file refs |
| T2 | Expand `readme/USAGE.rst` 15 → ~120 lines (end users / admins) | `readme/USAGE.rst` | ~105 | 15 (overwrite) | **YES** — standalone RST fragment |
| T3 | Expand `readme/CONFIGURE.rst` 7 → ~100 lines (admins + technical devs) | `readme/CONFIGURE.rst` | ~93 | 7 (overwrite) | **YES** — standalone RST fragment |
| T4 | NEW `docs/DEVELOPER_APPENDIX.md` ~250 lines (6 reference sections) | `docs/DEVELOPER_APPENDIX.md` | ~250 | n/a (create) | **YES** — standalone MD technical reference |
| T5 | Static verification + optional consolidated commit + optional Hindsight update | (no source content changes; test-only) | 0 | 0 | DEPENDS on T1-T4 finishing first |

Dependency graph: `T5 depends on {T1, T2, T3, T4}` — all four T1-T4 may run in parallel in any order.

Parallel execution OK?: YES for T1-T4 (no overlap, no inter-file cross-references within the same document set — the only cross-file references are spec-level and the verification script in T5).
