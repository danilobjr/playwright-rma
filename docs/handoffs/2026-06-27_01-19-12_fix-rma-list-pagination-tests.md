# Fix RMA List Pagination Unit Tests

## Current State

**What was accomplished:**

5 of 8 failing unit tests in `src/pages/rma/list/rma-list.page.test.tsx` were fixed:

1. **AppSelect** — Removed hardcoded `aria-label="Status"`
2. **PaginationRowCount** — Removed "pages" suffix
3. **Pagination button aria-labels** — Capitalized to "Go to next page", etc.
4. **Test assertions** — Stripped "Showing" prefix from 6 `getByText` calls

**Still failing (3 tests):**

- `paginates RMA Requests with visible range and total count`
- `deletes visible RMA Request and updates pagination`
- `resets pagination when filters reduce results`

All fail at `getByText('1-10 of 12')` — pagination element is not in the DOM.

## Investigation so far

- `data-slot="pagination-row-count"` returns 0 matches in test output — pagination subtree absent from DOM
- `Pagination` component's self-closing `<div ... />` confirmed NOT the bug — React's `createElement` spreads `children` through `{...otherProps}` correctly (verified via `renderToString`)
- `DataTablePagination` is inside `displayedRequests.length !== 0` branch (rma-list.page.tsx:414), receives correct props: `pageCount=2, pageIndex=0, pageSize=10, rowCount=12`
- Zero console errors/warnings during test runs
- `getRenderedRmaIds().toHaveLength(10)` passes — RMA cards render, but pagination below them never mounts

**Suspected cause:** Something in `DataTablePagination` children tree throws during render, preventing the entire `Pagination` subtree (including `PaginationRowCount`) from mounting. Top candidates:

1. `PaginationPageSizeSelector` → `AppSelect` → `Select` chain
2. `DataTablePaginationPageSelector` → `usePagination` → `computePaginationTokens`
3. One of `PaginationButton`/`PaginationItem` children

## Actions completed

- `src/services/api/rma/rma-request.service.ts` — `seedRmaRequests` grew from 2 → 12 items (RMA-2026-1001 through RMA-2026-1012)

## Unresolved questions

- Which specific child of `DataTablePagination` causes the render failure? Needs isolation (incremental component removal or `screen.debug()` with full DOM).

## Suggested skills

- `diagnose` — Systematic debug loop for remaining test failures
- `playwright-best-practices` — testing-library query/text matching in JSDom
- `gitnexus-debugging` — Trace execution flows through pagination component tree
- `tdd` — Red-green-refactor if new Pagination component tests are needed

## Related files

- `src/pages/rma/list/rma-list.page.test.tsx` — Failing assertions at lines 367, 392, 499–500
- `src/components/ui/pagination/pagination.ui.tsx` — Pagination (line 19), PaginationRowCount (line 201)
- `src/components/ui/data-table/data-table.ui.tsx` — DataTablePagination (line 38), DataTablePaginationPageSelector (line 95)
- `src/components/ui/data-table/use-pagination/compute-pagination-tokens.util.ts`
- `src/components/ui/data-table/use-pagination/use-pagination.hook.ts`
- `src/services/api/rma/rma-request.service.ts` — seedRmaRequests
- `src/pages/rma/list/rma-list.page.tsx` — Page component, DataTablePagination at line 795
