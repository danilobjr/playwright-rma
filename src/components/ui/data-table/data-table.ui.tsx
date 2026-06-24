import type { Option } from '@/components/app/app-select.app'
import {
  usePagination,
  type UsePaginationOptions,
} from '@/components/ui/data-table/use-pagination'
import {
  Pagination,
  PaginationButton,
  PaginationButtonFirst,
  PaginationButtonLast,
  PaginationButtonNext,
  PaginationButtonPrevious,
  PaginationDots,
  PaginationItem,
  PaginationPageSelector,
  PaginationPageSizeSelector,
  PaginationRowCount,
  PaginationSeparator,
} from '@/components/ui/pagination'
import { cn } from '@/utils/styles/cn.util'

import * as styles from './data-table.styles'

// <DataTablePagination className={classNamePagination} table={table} />

type PageSize = 5 | 10 | 20 | 35 | 50 | 100

type DataTablePaginationProps = {
  className?: string
  pageCount: number
  pageIndex: number
  pageSize: number
  rowCount: number
  sizes?: PageSize[]
  onChangePageIndex?: (index: number) => void
  onChangePageSize?: (size: PageSize) => void
}
function DataTablePagination({
  className = '',
  pageCount = 1,
  pageIndex = 0,
  pageSize = 10,
  rowCount = 0,
  sizes = [5, 10, 20, 35, 50, 100],
  onChangePageIndex = () => {},
  onChangePageSize = () => {},
}: DataTablePaginationProps) {
  const firstRowNumberOnCurrentPage = pageIndex * pageSize + 1
  const lastRowNumberOnCurrentPage = (() => {
    const rowNumber = pageIndex * pageSize + pageSize
    return rowNumber <= rowCount ? rowNumber : rowCount
  })()

  const options: Option[] = sizes.map<Option>((s) => ({
    text: s.toString(),
    value: s.toString(),
  }))
  const rowsPerPageValue = pageSize.toString()

  return (
    <Pagination className={cn(styles.pagination(), className)}>
      <PaginationPageSizeSelector
        options={options}
        value={rowsPerPageValue}
        onValueChange={(value) => {
          onChangePageSize(Number(value) as PageSize)
        }}
      >
        {rowsPerPageValue}{' '}
        <span className="hidden text-muted-foreground sm:inline">per page</span>
      </PaginationPageSizeSelector>

      <PaginationSeparator orientation="vertical" />

      <PaginationRowCount
        firstRowNumberOnCurrentPage={firstRowNumberOnCurrentPage}
        lastRowNumberOnCurrentPage={lastRowNumberOnCurrentPage}
        totalRows={rowCount}
      />

      <DataTablePaginationPageSelector
        className="ml-auto"
        currentPage={pageIndex + 1}
        totalPages={pageCount}
        boundaries={0}
        onChangeCurrentPage={(page) => onChangePageIndex(page - 1)}
      />
    </Pagination>
  )
}

type DataTablePaginationPageSelectorProps = UsePaginationOptions & {
  className?: string
}
function DataTablePaginationPageSelector({
  className = '',
  currentPage,
  totalPages,
  ...otherProps
}: DataTablePaginationPageSelectorProps) {
  const pagination = usePagination({
    currentPage,
    totalPages,
    ...otherProps,
  })

  return (
    <PaginationPageSelector className={className}>
      <PaginationItem>
        <PaginationButtonFirst
          disabled={pagination.currentPage === 1}
          onClick={pagination.goFirst}
        />
      </PaginationItem>

      <PaginationItem>
        <PaginationButtonPrevious
          disabled={pagination.currentPage === 1}
          onClick={pagination.goPrevious}
        />
      </PaginationItem>

      {pagination.tokens.map((token, index) => (
        <PaginationItem key={`${index}-${token}`}>
          {token === 'DOTS' ? (
            <PaginationDots />
          ) : (
            <PaginationButton
              active={token === pagination.currentPage}
              onClick={() => pagination.setCurrentPage(token)}
            >
              {token}
            </PaginationButton>
          )}
        </PaginationItem>
      ))}

      <PaginationItem>
        <PaginationButtonNext
          disabled={pagination.currentPage === totalPages}
          onClick={pagination.goNext}
        />
      </PaginationItem>

      <PaginationItem>
        <PaginationButtonLast
          disabled={pagination.currentPage === totalPages}
          onClick={pagination.goLast}
        />
      </PaginationItem>
    </PaginationPageSelector>
  )
}

export { DataTablePagination }
