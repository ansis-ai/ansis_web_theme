# Contributing to ANSIS Web Theme

We welcome contributions to improve **ANSIS Web Theme**! This repository follows the guidelines and quality standards established by the [Odoo Community Association (OCA)](https://odoo-community.org/).

---

## Code of Conduct

Please maintain a respectful, collaborative, and inclusive environment.

---

## Development & Contribution Guidelines

### 1. OWL 2 & JavaScript
- Avoid strict XML replacements (`t-inherit-mode="replace"`) of core Odoo components.
- Use OWL prototype patching (`patch(Component.prototype, { ... })`) and lifecycle hooks (`onMounted`, `onPatched`, `onWillUnmount`).
- Keep all custom JavaScript modular under `static/src/webclient/` and `static/src/views/`.

### 2. SCSS & Styling
- Do not use hardcoded pixel values when existing Bootstrap or Odoo variables apply.
- Use CSS custom properties (`var(--...)`) for dynamic color schemes and palette tokens.
- Keep stylesheets isolated by component to avoid global style bleeding.

### 3. OCA Conventions & Quality
- Include the standard copyright header on every Python and JavaScript file:
  ```python
  # Copyright 2024-2026 ANSIS Pte Ltd
  # License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
  ```
- Format code using `pre-commit` (running `black`, `ruff`, `prettier`, and `flake8`).
- Maintain version numbers following `<odoo_version>.<major>.<minor>.<patch>` (e.g. `18.0.1.0.0`).

---

## Submitting Pull Requests

1. Fork the repository on GitHub.
2. Create a feature branch: `git checkout -b 18.0-feature-my-enhancement`.
3. Test changes locally on Odoo 18.0 Community.
4. Commit using conventional commit messages (e.g., `feat: ...`, `fix: ...`, `docs: ...`).
5. Open a Pull Request against the `18.0` branch of `ansis-ai/ansis_web_theme`.

---

## License

By contributing to this repository, you agree that your contributions will be licensed under the **GNU Lesser General Public License v3.0 (LGPL-3.0)**.
