---
name: front-structure
description: Enforces frontend codebase file/folder structure, strict file suffixes, naming conventions, export style, and responsibility boundaries. Use when creating, moving, renaming, or reviewing files, components, hooks, services, utilities, models, constants, config, pages, routing, styling, or frontend architecture conventions.
---

# Front Structure

## Quick Start

Before creating or moving code, identify its responsibility, place it in the correct folder, and use the strict suffix. Before creating any new file or folder, propose the name and ask the user to critique or approve it.
If a requested location violates these boundaries, redirect to the correct location and explain briefly. Prefer focused structure changes; do not mass-migrate unrelated files during feature work unless the user asks.

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
- Type-only file: `name.type.ts`
- Service file: `name.service.ts`
- Utility file: `name.util.ts`
  For local one-off support components inside a page folder, prefer the closest meaningful suffix. `index.ts` is allowed only as a folder public API. Do not invent new suffixes unless the project already has one.

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

If a file exports a React component, it may export only one component plus its props type, or one tightly-coupled component family plus each component props type. Do not mix unrelated components. Do not export helpers, constants, unrelated types, or re-exports from the same file as a component; extract them to a `.util.ts`, `.constant.ts`, `.model.ts`, `.hook.ts`, or adjacent local file.
Components with props must define a named `ComponentNameProps` type and use it in the component signature. Components with no props do not need a props type. Inline props type annotations are not allowed. Export the props type before the runtime component export.
Import React APIs directly by name. Prefer `import { useEffect, type ComponentProps } from 'react'` over `import * as React from 'react'`. Keep type imports marked with `type`. Use `React.*` namespace access only when namespace behavior is explicitly needed.

Example:

```ts
import { useEffect, type ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'>

function Button(props: ButtonProps) {
  useEffect(() => {
    // ...
  }, [])

  return <button {...props} />
}

export type { ButtonProps }

export { Button }
```

## Component Props

For every component kind, order destructured props as `children`, `className`, other `className*` props sorted alphabetically, `id`, other named props sorted alphabetically, then `...otherProps`. Set default values whenever safe. Do not default required props or props where `undefined` has semantic meaning.

```tsx
function ComponentName({
  children = null,
  className = '',
  classNameD = '',
  classNameJ = '',
  id = '',
  propK = Status.PENDING,
  propV = false,
  ...otherProps
}: ComponentNameProps) {}
```

## JSX Props

Order JSX props as `className`, then other `className*` props sorted alphabetically, then `data-slot`, then remaining props. `className*` means any prop whose name starts with `className`, such as `classNameContainer`, `classNameIcon`, or `classNameText`. Native elements cannot receive custom `className*` props; use only `className` there. If `data-slot` exists and there are no `className` or `className*` props, `data-slot` comes first.

Never pass `className` into `cva` variant functions. Pass generated classes and external `className` separately to `cn`.

```tsx
className={cn(componentVariants({ size, variant }), className)}
```

When destructuring component props with a rest spread, name the rest value `otherProps`. Use `props` only for a non-destructured props object.

```tsx
function ComponentName({ asChild = false, ...otherProps }: ComponentNameProps) {
  const Comp = asChild ? Slot.Root : 'div'

  return <Comp {...otherProps} />
}

function ComponentName(props: ComponentNameProps) {
  return <div {...props} />
}
```

## UI Component Folders

Reusable UI components in `src/components/ui` use one folder per component or component family. New or touched UI components must follow this shape:

```txt
src/components/ui/component-name
├── component-name.ui.tsx
├── component-name.styles.ts
└── index.ts
```

Use `component-name.ui.tsx` for the component or component family. Use `component-name.styles.ts` for `cva`, variant maps, long Tailwind class strings, slot styling, reusable style constants, and style-derived types. Component families should define one variant builder per exported component or subcomponent, e.g. `cardVariants`, `cardHeaderVariants`, and `cardTitleVariants`. Format Tailwind values with multiple classes as multiline template literals with one class per line. Keep single-class values inline. If a constant contains only Tailwind utility classes (no `cva`), wrap the template literal with `tw()` from `@/utils/styles/tw.util.ts`. Style files may export style builders/constants and related types only. They must not export React components, hooks, services, or app logic.

Example:

```ts
import { cva, type VariantProps } from 'cva'

const buttonVariants = cva('...', {
  variants: {
    variant: {
      default: `
        bg-primary
        text-primary-foreground
        hover:bg-primary/80
      `,
      icon: `size-8`,
    },
  },
})

type ButtonVariants = VariantProps<typeof buttonVariants>

export type { ButtonVariants }

export { buttonVariants }
```

Constants with only Tailwind classes use `tw()`:

```ts
import { tw } from '@/utils/styles/tw.util'

// Don't:
const styles = `
  mx-auto
  flex
  items-center
`

// Do:
const styles = tw(`
  mx-auto
  flex
  items-center
`)
```

Folder `index.ts` is the public import surface. Use wildcard re-exports with `export type *` and `export *` from the UI file. Do not list individual exports.

```ts
export type * from './component-name.ui'

export * from './component-name.ui'
```

Consumers import from the folder path, e.g. `@/components/ui/component-name`. Internal files import relatively, e.g. `./component-name.styles`.

If shadcn generates a flat file, normalize any touched component to this folder convention after generation. If the user asks to migrate existing UI components, update the requested components to this shape; otherwise do not migrate unrelated components during focused work.

## Hook Placement

Component-private hooks live beside the owning component as `use-name.hook.ts`. Cross-UI-component hooks live in `src/components/ui/shared/hooks`. Cross-entire-app hooks live in `src/hooks/<context>`. API hooks live in `src/hooks/api/<context-folder>` and call API services.

## Shared Component Types

Shared prop types used across UI, app, or page components live in `src/components/shared/types`. `src/components/shared/types/as-child-prop.type.ts` is required and owns the canonical `AsChildProp` type for components that expose `asChild`. Do not redefine `asChild?: boolean` inline in each component.

## Page Composition

Routes must render page containers, not page components directly.

Example flow:

```txt
src/config/router.config.tsx
-> src/pages/rma/create/rma-create.container.tsx
-> src/pages/rma/create/rma-create.page.tsx
```

Page containers own route params, navigation, app hooks, services, loading/error/mutation orchestration, and layout configuration.
Page components render prepared props only. They must not call router hooks, data services, or mutation hooks.

Shared app layout belongs in `src/components/app/layout.app.tsx`.
Pages configure shared layout through `useLayout`.
Layout supports breadcrumbs, page title, description, `topRightAction`, and page content.

## Responsibility Boundaries

- `src/components/ui`: reusable presentation components; no router hooks, app hooks, query hooks, service imports, API calls, app-specific fetching, or page/domain orchestration.
- `src/components/shared/types`: reusable type-only helpers for UI, app, or page components.
- `src/components/app`: project-specific composed components; may use app hooks but should not become page containers.
- `src/pages/<domain>/<action>`: route/page-specific page, container, and local support code.
- Page components: define macro layout, receive data/callbacks through props, do not fetch data, and do not own navigation.
- Page containers: call hooks/services, own loading/error/mutation/navigation orchestration, and pass prepared data/handlers to one page component.
- `src/components/ui/shared/hooks`: hooks shared across multiple UI components only.
- `src/hooks/api/<context-folder>`: TanStack Query hooks that call API services.
- `src/hooks/<context>`: hooks shared across the entire app.
- Page-only hooks can live beside the owning page.
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
   │   ├── shared
   │   │   └── types
   │   │       └── as-child-prop.type.ts   Required
   │   └── ui
   │       ├── shared
   │       │   └── hooks
   │       └── component-name   Example
   │           ├── component-name.ui.tsx
   │           ├── use-name.hook.ts       Example
   │           ├── component-name.styles.ts
   │           └── index.ts
   ├── config
   ├── constants
   ├── hooks
   │   ├── api
   │   │   └── context-folder
   │   └── context          Example
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

When adding code: identify responsibility, choose folder, propose new file/folder names for critique, use strict suffixes, keep reusable code separate from page-local code, keep exports named and at the end, split mixed responsibilities, normalize touched UI components to folder convention, and redirect structure violations.
When reviewing code: check placement, suffixes, casing, export style, UI folder public API, style extraction, React component export isolation, data-fetching boundaries, and separation between utilities, constants, models, services, hooks, and components.
