---
name: front-structure
description: Enforces frontend codebase file/folder structure, strict file suffixes, naming conventions, export style, and responsibility boundaries. Use when creating, moving, renaming, or reviewing files, components, hooks, services, utilities, models, constants, config, pages, routing, styling, or frontend architecture conventions.
---

# Front Structure

## Quick Start

Before creating or moving code, identify its responsibility, place it in the correct folder, and use the strict suffix. Before creating any new file or folder, propose the name and ask the user to critique or approve it.
If a requested location violates these boundaries, redirect to the correct location and explain briefly.

## Naming

Use intention-revealing, searchable, pronounceable names. Avoid vague names, misleading names, type encodings, arbitrary abbreviations, and magic numbers.
Use `kebab-case` for file names, `camelCase` for variables/functions, `PascalCase` for components/classes/types, and named constants instead of repeated magic values.

## Strict File Suffixes

- UI component: `name.ui.tsx`
- App component: `name.app.tsx`
- Page component: `name.page.tsx`
- Page container: `name.container.tsx`
- Config file/component: `name.config.ts` or `name.config.tsx`
- Constant file: `name.constant.ts`
- Hook file: `use-name.hook.ts`
- Model/type file: `name.model.ts`
- Service file: `name.service.ts`
- Utility file: `name.util.ts`
  For local one-off support components inside a page folder, prefer the closest meaningful suffix. Do not invent new suffixes unless the project already has one.

## Exports

Use named exports only. Do not use default exports. Place exports at the end of the file.
Separate runtime exports from type exports with one empty line:

```ts
type HexString = `#${string}`

function convertToHex(value: string): HexString {
  return `#${value}`
}

export type { HexString }

export { convertToHex }
```

## React Components

If a file exports a React component, it should export only that component. Do not export helpers, constants, types, or re-exports from the same file as a component; extract them to a `.util.ts`, `.constant.ts`, `.model.ts`, `.hook.ts`, or adjacent local file.

## Responsibility Boundaries

- `src/components/ui`: reusable presentation components; no API calls or app-specific fetching.
- `src/components/app`: project-specific composed components; may use app hooks but should not become page containers.
- `src/pages/<domain>/<action>`: route/page-specific page, container, and local support code.
- Page components: define macro layout, receive data/callbacks through props, do not fetch data, and do not own navigation.
- Page containers: call hooks/services, own loading/error/mutation/navigation orchestration, and pass prepared data/handlers to one page component.
- `src/hooks/api`: TanStack Query hooks that call API services.
- Other hooks: state/lifecycle hooks belong in hook subfolders; page-only hooks can live beside the owning page.
- `src/services/api/<domain>`: API service functions; do not import React components.
- `src/config`: app providers, TanStack Router setup, route trees, query clients, and app-level configuration.
- `src/constants`: context-specific constants.
- `src/styles`: global styles; Tailwind CSS v4+ is the styling baseline.
- `src/utils`: reusable helpers; subfolders are examples and should be created by responsibility/context.
- `src/utils/styles/cn.util.ts`: required canonical class-name utility.
- `src/utils/types`: reusable utility types; subfolders are examples and should be created by type/helper context.

## Folder Structure

Follow this structure. Example-only folders are marked as examples.

```txt
root
├── public
└── src
   ├── assets
   ├── components
   │   ├── app
   │   └── ui
   ├── config
   ├── constants
   ├── hooks
   │   ├── api
   │   ├── state-management
   │   └── life-cycle
   ├── pages
   │   └── domain
   │       ├── list
   │       ├── create
   │       └── update
   ├── services
   │   └── api
   │       └── domain
   ├── styles
   │   └── index.css
   └── utils
       ├── array              Example
       ├── record             Example
       ├── number             Example
       ├── string             Example
       ├── styles
       │   └── cn.util.ts     Required
       └── types
           ├── array          Example
           ├── record         Example
           ├── number         Example
           └── string         Example
```

## Agent Workflow

When adding code: identify responsibility, choose folder, propose new file/folder names for critique, use strict suffixes, keep reusable code separate from page-local code, keep exports named and at the end, split mixed responsibilities, and redirect structure violations.
When reviewing code: check placement, suffixes, casing, export style, React component export isolation, data-fetching boundaries, and separation between utilities, constants, models, services, hooks, and components.
