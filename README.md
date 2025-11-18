# kep-new-frontend

This repository hosts the front-end migration of the KEP Uz project. The objective is to rebuild the existing Angular experience in a new React/Material UI stack while adopting the design language from the Aurora template.

## Repository layout
- **angular-frontend**: Legacy Angular implementation. Use this project as the source of truth for current features and behaviors.
- **new-frontend**: Ongoing React + MUI rewrite. Functionality should be ported here while aligning visuals with the Aurora template.
- **aurora-template**: Full reference for the Aurora design system and UI patterns to mirror in the new React app.

## Migration approach
1. Map features from `angular-frontend` and reproduce them in `new-frontend` to maintain parity.
2. Apply styling, layout, and interaction ideas from `aurora-template` so the React app matches the desired Aurora look and feel.
3. Favor TypeScript, functional components, hooks, and MUI theming in `new-frontend` to keep implementation consistent.

## Getting started
- Inspect the Angular app for behavior details: `cd angular-frontend` and follow its README.
- Develop the React rewrite in `new-frontend`, pulling UI inspiration from `aurora-template` as you implement features.
- Keep documentation concise and focused on the migration steps above.
