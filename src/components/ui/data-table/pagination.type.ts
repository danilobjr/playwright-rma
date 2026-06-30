type PageSize = 5 | 10 | 20 | 35 | 50 | 100

type PaginationSortingState<SortingProp> = {
  sortProp?: SortingProp
  direction?: 'asc' | 'desc'
}

type PaginationState = {
  /** The zero-based index of the current page. */
  pageIndex: number
  pageSize: PageSize
}

type PaginationTotals = {
  /** The total number of pages available based on the current page size and total rows. @todo */
  totalPages?: number
  totalRows?: number
}

type Pagination<
  T,
  SortingProp extends keyof T = keyof T,
> = PaginationSortingState<SortingProp> & PaginationState & PaginationTotals

export type {
  PageSize,
  Pagination,
  PaginationTotals,
  PaginationState,
  PaginationSortingState,
}
