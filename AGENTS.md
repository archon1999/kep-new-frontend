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

## AI agentga qo'shimcha ko'rsatmalar

### 1. AI agentga umumiy maqsadni qanday tushuntirish
Buni inglizchada yozgan ma’qul, agentga “system / general” prompt sifatida:

> I have a monorepo with three folders:
>
> * `angular-frontend`: existing production frontend for KEP.uz written in Angular.
> * `new-frontend`: new React + MUI app, created from Aurora MUI starter kit. This will become the main frontend.
> * `aurora-template`: the original full Aurora MUI template (reference for layout, components and design patterns).
>
> Goal:
>
> * Migrate features and pages from `angular-frontend` into `new-frontend`.
> * The **source of truth for business logic, flows and data** is `angular-frontend`.
> * The **source of truth for UI/UX and visual design** is `aurora-template`.
> * I do **not** want to copy the old Angular HTML/CSS design. Every page in React must look and feel like the Aurora template (layout, typography, spacing, colors, components).
>
> Very important rules:
>
> 1. When migrating a feature:
>
>    * Reuse Aurora components, layouts and patterns from `aurora-template` as much as possible.
>    * Do not copy old Angular styles or markup unless absolutely necessary for some UX detail.
> 2. Keep the business logic, API contracts and flows equivalent to Angular:
>
>    * Same endpoints, query params, pagination, filters, validation rules, etc.
>    * If something is unclear, infer from the Angular code first.
> 3. Code style:
>
>    * Use MUI and Aurora’s design system tokens and components.
> 4. Architecture:
>
>    * All new code goes into `new-frontend`.
>    * `aurora-template` is read-only reference for design.
>    * `angular-frontend` is read-only reference for existing behavior.
>
> When I give you a task, always:
>
> * Identify the corresponding Angular components/services in `angular-frontend`.
> * Identify a suitable Aurora layout/component pattern in `aurora-template`.
> * Propose a React implementation in `new-frontend` that matches Aurora’s UI but preserves Angular’s behavior.
> * Show me what files to create/change and how to wire routes, state and API calls.

### 2. “Source of truth”ni doim yozib ber
- Biznes logika va flow: Angular koda.
- UI/UX: Aurora template.
Agent chalkashmasligi uchun har safar promptga alohida qayd qil.

### 3. Refactor talabi
Migratsiya paytida agentga shuni de: "when migrating, if you see obvious improvements (unused code, duplicated logic), you may propose a small refactor, but keep behavior unchanged."
