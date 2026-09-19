# Autonomous Agent Directives

## Behavioral Constraints
- Never install new npm packages or modify build configuration files unless explicitly ordered.
- Never edit backend Java files (`src/main/java`) when tasked with frontend UI changes.
- Always use standard system fonts and pure Tailwind/CSS variables. Do not generate arbitrary hex inline styles.

## UI Design Standards
- Radius: Always use 6px (`rounded-md`) for buttons/inputs, 10px (`rounded-xl`) for panels. Avoid `rounded-full`.
- Theme: Command-center dark mode (`#070a12` canvas, `#0e1424` cards, `#38bdf8` light blue accents).
