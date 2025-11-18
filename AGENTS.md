# Repo-wide agent guidance

This repository holds three front-end codebases that need to stay aligned during the migration from the legacy Angular app to the new React/MUI app. Follow these rules when updating any part of the repo:

- Prioritize the `new-frontend` React app as the target for all new work. Reuse functionality from `angular-frontend`, but adopt the visual language and patterns from `aurora-template`.
- Prefer TypeScript and functional React components with hooks in `new-frontend`; match Material UI styling and theming from the Aurora template.
- Keep feature parity with the Angular app first, then refine styling to match Aurora.
- When adding documentation, keep it concise and actionable for future contributors involved in the migration.
- Do not introduce try/catch around imports.
