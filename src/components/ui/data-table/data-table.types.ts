type PaginationState = {
  pageIndex: number
  pageSize: number
}

type PaginationCounters = {
  pageCount: number
  rowCount: number
}

type Pagination = PaginationState & PaginationCounters

type SortingState = {
  prop: string
  direction: 'asc' | 'desc'
}[]

export type { Pagination, PaginationCounters, PaginationState, SortingState }
