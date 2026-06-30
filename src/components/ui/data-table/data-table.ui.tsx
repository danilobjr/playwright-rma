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
import type {
  PageSize,
  PaginationTotals,
  Pagination as PaginationType,
} from './pagination.type'

type DataTablePaginationProps<SortingProp = unknown> =
  PaginationType<SortingProp> &
    PaginationTotals & {
      className?: string
      pageSizeChoices?: PageSize[]
      onChangePagination?: (
        pagination: Partial<PaginationType<SortingProp>>,
      ) => void
    }

function DataTablePagination<SortingProp = unknown>({
  className = '',
  pageIndex = 0,
  pageSize = 10,
  pageSizeChoices = [5, 10, 20, 35, 50, 100],
  totalPages = 0,
  totalRows = 0,
  onChangePagination = () => {},
}: DataTablePaginationProps<SortingProp>) {
  const firstRowNumberOnCurrentPage = pageIndex * pageSize + 1
  const lastRowNumberOnCurrentPage = (() => {
    const rowNumber = pageIndex * pageSize + pageSize
    return Math.min(rowNumber, totalRows || Number.MAX_SAFE_INTEGER)
  })()

  const options: Option[] = pageSizeChoices.map<Option>((s) => ({
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
          onChangePagination({ pageSize: Number(value) as PageSize })
        }}
      >
        {rowsPerPageValue}{' '}
        <span className="hidden text-muted-foreground sm:inline">per page</span>
      </PaginationPageSizeSelector>

      <PaginationSeparator orientation="vertical" />

      <PaginationRowCount
        firstRowNumberOnCurrentPage={firstRowNumberOnCurrentPage}
        lastRowNumberOnCurrentPage={lastRowNumberOnCurrentPage}
        totalRows={totalRows}
      />

      <DataTablePaginationPageSelector
        className="ml-auto"
        currentPage={pageIndex + 1}
        totalPages={totalPages || Math.ceil(totalRows / pageSize)}
        boundaries={0}
        onChangeCurrentPage={(newCurrentPage) =>
          onChangePagination({ pageIndex: newCurrentPage - 1 })
        }
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
