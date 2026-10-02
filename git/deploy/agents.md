# Autonomous Agent Directives

## Behavioral Constraints
- Never install new npm packages or modify build configuration files unless explicitly ordered.
- Never edit backend Java files (`src/main/java`) when tasked with frontend UI changes.
- Always use standard system fonts and pure Tailwind/CSS variables. Do not generate arbitrary hex inline styles.

## Multi-Target Synchronization Directives
- **Mirror Consistency**: Any updates to root `css/`, `js/`, `frontend/`, `index.html`, or `api/` must be synchronized into `deploy/` and `git/` to preserve deployment fidelity.
- **Asset Completeness**: Ensure `deploy/` contains all runtime dependencies (`images/`, `landing.html`, `.vercelignore`, and documentation).
- **Clean Git Mirrors**: Do not commit Python bytecode (`__pycache__/`, `*.pyc`), SQLite journals (`*.db-wal`), or recursive mirror clones (`git/git/`).

## Quality Assurance & Verification
- **Code Zero-Defect Rule**: Before declaring work complete, verify all tests pass (`./mvnw.cmd test` for Java 35/35, `node --test tests/*.test.js` for Node.js 14/14). If `code == error`, return and fix before proceeding.
- **Documentation Currency**: Ensure all `.md` files (`README.md`, `dir.md`, `project_build_history.md`, `pbl.md`, `spec.md`) accurately reflect verified metrics and active architecture.
