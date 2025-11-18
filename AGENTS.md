# Repo-wide agent guidance

This repository holds three front-end codebases that need to stay aligned during the migration from the legacy Angular app to the new React/MUI app. Follow these rules when updating any part of the repo:

- Prioritize the `new-frontend` React app as the target for all new work. Reuse functionality from `angular-frontend`, but adopt the visual language and patterns from `aurora-template`.
- Prefer TypeScript and functional React components with hooks in `new-frontend`; match Material UI styling and theming from the Aurora template.
- Keep feature parity with the Angular app first, then refine styling to match Aurora.
- When adding documentation, keep it concise and actionable for future contributors involved in the migration.
- Do not introduce try/catch around imports.

## Front-end conventions
- Prefer `KepIcon` for icons across the apps unless a feature explicitly requires a different icon set.
- Every task should ship i18n strings for `uz`, `ru`, and `en`. Source translations from the `angular-frontend` i18n files and use the legacy i18n set as the shared dictionary.

## Module architecture template
Use the following directory layout for each module:

```
/modules/branch/
  data-access/
    api/
      http.client.ts        # Orval client instance wrap (baseURL, headers, auth)
    dto/
      module.dto.ts         # (ixtiyoriy) alias/typelar – generated’dan re-export
    mappers/
      module.mapper.ts      # DTO ↔ Domain Entity
    repository/
      http.module.repository.ts  # Port implementatsiyasi (Orval client’dan foyd.)
  domain/
    ports/
      module.repository.ts  # INTERFACE
    entities/
      module.entity.ts
  application/
    queries.ts
    mutations.ts
```
