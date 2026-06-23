# Plan: Sync Pencil design with implemented code

## Context

The RMA update screen was implemented in PR #55 based on issue #44 PRD. Several visual and structural gaps exist between the Pencil design (`docs/playwright-rma-design.pen`) and the shipped code. This plan covers 10 tasks to close those gaps.

---

## Task 1 — Rework status popover design (Pencil only)

**File:** `docs/playwright-rma-design.pen` — Screen 3 popover section

- Redesign the workflow popover to final state
- No code changes needed — popover is backlog #58

---

## Task 2 — Toast: review design copy, then implement

**Design review** — `Component - Toast Notifications` panel:

| Variant | Title | Description | Badge |
|---|---|---|---|
| Success | `RMA saved` | `The request was created or updated successfully.` | `create/edit` |
| Error | `Application error` | `Something broke while saving. Try again or contact support.` | `front/back` |
| Warning | `Check form details` | `Some information looks invalid. Review highlighted fields.` | `validation` |

**Current code toasts:**

| File | Current message | Target |
|---|---|---|
| `rma-create.container.tsx` | `RMA request created` | Success: "RMA saved" + desc |
| `rma-update.container.tsx` | `RMA request status updated` | Success: "RMA saved" + desc |
| `rma-list.container.tsx` | `RMA Request deleted` | Success: "RMA saved" + desc (new variant) |

**Implementation approach:**
- Create a custom toast component matching Pencil: icon container (colored circle + icon), title + description stack, close button
- Use sonner's `toast.custom()` or `toast` with rich JSX
- Replace current `toast.success('text')` calls

**Files:** `src/pages/rma/*.container.tsx`, new `src/components/ui/toast/` or inline rich JSX in containers

---

## Task 3 — Remove Rejected card from summary

**File:** `src/pages/rma/list/rma-list.page.tsx`

**Design:** 4 summary cards: Total (128), Approved (42), Pending (19), Completed (67) — no Rejected
**Current:** 5 cards (Total + 4 statuses including Rejected)

- Drop Rejected from `statusCounts` initialization (lines 197-208)
- Drop Rejected from the summary cards loop (lines 340-380) — iterate `RMA_STATUS_ORDER.filter(s => s !== 'Rejected')`

---

## Task 4 — Redesign summary cards to match Pencil exactly

**File:** `src/pages/rma/list/rma-list.page.tsx:311-381`

**Pencil design:**
```
┌──────────────────────┐
│ CardTitle - Total    │
│ CardMetric - 128     │
│ CardDescription      │
└──────────────────────┘
```
- `cornerRadius: 12`, `gap: 8`, `padding: 18`, `stroke: #E4E4E7`
- Simple vertical stack, **no button wrapper**, **no icon**, **no CardHeader/CardContent split**
- 4 cards in a row: Total, Approved, Pending, Completed

**Changes:**
- Flatten each card: remove `<button>`, `<CardHeader>`, `<CardContent>`
- Use simple `<div>` with vertical layout, title label, metric value, description
- Remove `<ClipboardListIcon>` and status icons from summary cards
- Click handlers for filtering (Total / status) remain but attach to card itself or remove entirely (design has no click affordance)

---

## Task 5 — Remove 'View columns' button from design

**File:** `docs/playwright-rma-design.pen` — Screen 1 "View columns button" node

Remove from the CardHeader—DataTable since it's not being implemented.

---

## Task 6 — Fix date input label (design)

**File:** `docs/playwright-rma-design.pen` — Screen 1 "Date range Field"

Rename to single date picker. Implementation already uses single date (`Calendar mode="single"`). Update the design label to match.

---

## Task 7 — Swap Search and Reset buttons

**File:** `src/pages/rma/list/rma-list.page.tsx:499-529`

Current order: **Search** (filled) → **Reset** (outlined)
New order: **Reset** (outlined) → **Search** (filled)

Swap the two `<Tooltip>` blocks and their `<Button>` elements.

---

## Task 8 — Standardize button/input/textarea sizes

**Base height:** 36px (`h-9`) for buttons and inputs, except buttons on pagination, data table, and page header action.

### button.styles.ts — Replace `size` CVA variant

Current → new:

```ts
size: {
  '2xs': `
    h-6
    gap-1.5
    rounded-xs
    px-2
    text-xs
    has-[>svg]:px-2
  `,
  xs: `
    h-7
    gap-1.5
    px-3
    has-[>svg]:px-2.5
  `,
  sm: `
    h-8
    gap-1.5
    px-3
    has-[>svg]:px-2.5
  `,
  default: `
    h-9
    px-4
    py-2
    has-[>svg]:px-3
  `,
  lg: `
    h-10
    px-6
    has-[>svg]:px-4
  `,
  'icon-xs': 'size-7',
  'icon-sm': 'size-8',
  icon: 'size-9',
},
```

Removed: `icon-lg`, `rounded-[min(...)]`, `in-data-[slot=button-group]`, `text-[0.8rem]`, `has-data-[icon=inline-end/start]`, `[&_svg:not(...)]:size-3.5`, etc.

### input.tsx — Single file, inline Tailwind

| Current | Replace with |
|---|---|
| `h-8` | `h-9` |
| `px-2.5 py-1` | `px-3 py-1` |

### textarea.tsx — Single file, inline Tailwind

| Current | Replace with |
|---|---|
| `min-h-16` | `min-h-19.5` |
| `px-2.5 py-2` | `px-3 py-2` |

---

## Task 9 — Merge filters + table into one "Requests" card

**File:** `src/pages/rma/list/rma-list.page.tsx`

**Pencil design:** Single `<Card - DataTable>` →
```
┌──────────────────────────────────┐
│ CardHeader: "Requests" ↑        │
├──────────────────────────────────┤
│ Toolbar: search / status / date  │
│          [Reset]   [Search]      │
├──────────────────────────────────┤
│ Table: header + rows             │
├──────────────────────────────────┤
│ Footer: "0 of 12 row(s)" │Pages  │
└──────────────────────────────────┘
```

**Steps:**
1. Remove standalone filter `<Card>` (lines 383-533)
2. Add `<CardHeader>` with title "Requests" and description matching Pencil
3. Embed toolbar content directly below CardHeader, above the table
4. Add `<CardFooter>` wrapping pagination and selected-rows text

---

## Task 10 — Improve pagination

**Files:** `src/pages/rma/list/rma-list.page.tsx:820-856`, `src/components/ui/pagination/pagination.ui.tsx`

**Pencil design:** Numbered page buttons (page 1 highlighted as filled dark square, additional pages), prev/next outline buttons, selected-rows text on left.

**Current:** Prev/Next outline buttons only.

**Changes:**
- Add page number buttons using `PaginationLink` with `isActive` for current
- Show ellipsis for large page counts
- Add selected-rows text: `"0 of 12 row(s) selected."` (left side of footer)
- Keep excepted button sizes per task 8 exception

---

## Dependency graph

```
Task 1 (popover design) ──→ independent, Pencil only
Task 5 (remove View columns) → independent, Pencil only
Task 6 (date label fix) ──→ independent, Pencil only
         │
Task 2 (toast implementation) → after Task 1 & Task 8 (button sizes)
Task 3 (remove Rejected card) → after Task 4 (redesign cards)
Task 4 (redesign summary cards) → independent
Task 7 (swap buttons) ──→ after Task 9 (merge cards — layout affected)
Task 8 (button/input sizes) → blocks Task 2 (needs correct sizing)
Task 9 (merge into one card) → after Task 8 (uses correct sizes)
Task 10 (pagination) ──→ after Task 8 & Task 9 (uses correct sizing, lives in new CardFooter)
```

## Suggested parallel buckets

| Bucket | Tasks | Mode |
|---|---|---|
| Pencil-only | 1, 5, 6 | Design tool |
| Foundation | 8 | Code (blocking) |
| Post-foundation | 2, 9, 10, 7 | Code |
| Cards cleanup | 3, 4 | Code |
