import type {
  Pagination,
  PaginationTotals,
} from '@/components/ui/data-table/pagination.type'

type PaginatedData<T> = Pagination<T> &
  PaginationTotals & {
    data: ReadonlyArray<T>
  }

export type { PaginatedData }
