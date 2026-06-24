import { useMemo } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PaginationPageSelector } from '@/components/ui/pagination'
import { clamp } from '@/utils/numbers/clamp.util'

import {
  computePaginationTokens,
  type Token,
} from './compute-pagination-tokens.util'

type UsePaginationOptions = {
  currentPage: number
  totalPages: number
  /** Siblings amount on left/right side of selected page, defaults to 1 */
  siblings?: number
  /** Amount of elements visible on left/right edges, defaults to 1  */
  boundaries?: number
  onChangeCurrentPage?: (pageNumber: number) => void
}

interface UsePaginationReturnValue {
  tokens: Token[]
  currentPage: number
  setCurrentPage: (pageNumber: number) => void
  goNext: () => void
  goPrevious: () => void
  goFirst: () => void
  goLast: () => void
}

/**
 * Renders a representation of pages in the form of an array of numbers and DOTS
 * like: `[1, 'DOTS', 5, 6, 7, 'DOTS', 20]`. It works well with {@link PaginationPageSelector}.
 *
 * @example
 * import { MoreHorizontalIcon } from 'lucide-react'
 *
 * import {
 *   PaginationPageSelector,
 *   PaginationItem,
 *   PaginationButton,
 *   PaginationButtonFirst,
 *   PaginationButtonPrevious,
 *   PaginationButtonNext,
 *   PaginationButtonLast,
 * } from '@/components/ui/pagination'
 * import { UsePaginationOptions, usePagination } from '@/hooks/components/use-pagination.hook'
 *
 * type MyCustomPaginationPageSelectorProps = UsePaginationOptions
 * function MyCustomPaginationPageSelector({
 *   currentPage,
 *   totalPages,
 *   ...otherProps
 * }: MyCustomPaginationPageSelectorProps) {
 *   const pagination = usePagination({
 *     currentPage,
 *     totalPages,
 *     ...otherProps,
 *   })
 *
 *   return (
 *     <PaginationPageSelector>
 *       <PaginationItem>
 *         <PaginationButtonFirst
 *           disabled={pagination.currentPage === 1}
 *           onClick={pagination.goFirst}
 *         />
 *       </PaginationItem>
 *
 *       <PaginationItem>
 *         <PaginationButtonPrevious
 *           disabled={pagination.currentPage === 1}
 *           onClick={pagination.goPrevious}
 *         />
 *       </PaginationItem>
 *
 *       {pagination.tokens.map((token, index) => (
 *         <PaginationItem key={`${index}-${token}`}>
 *           {token === 'DOTS' ? (
 *             <PaginationDots />
 *           ) : (
 *             <PaginationButton
 *               active={token === pagination.currentPage}
 *               onClick={() => pagination.setCurrentPage(token)}
 *             >
 *               {token}
 *             </PaginationButton>
 *           )}
 *         </PaginationItem>
 *       ))}
 *
 *       <PaginationItem>
 *         <PaginationButtonNext
 *           disabled={pagination.currentPage === totalPages}
 *           onClick={pagination.goNext}
 *         />
 *       </PaginationItem>
 *
 *       <PaginationItem>
 *         <PaginationButtonLast
 *           disabled={pagination.currentPage === totalPages}
 *           onClick={pagination.goLast}
 *         />
 *       </PaginationItem>
 *     </PaginationPageSelector>
 *   )
 * }
 */
function usePagination({
  totalPages,
  siblings = 1,
  boundaries = 1,
  currentPage,
  onChangeCurrentPage = () => {},
}: UsePaginationOptions): UsePaginationReturnValue {
  const _total = clamp(Math.trunc(totalPages), { min: 0 })

  const setCurrentPage = (pageNumber: number) => {
    if (pageNumber <= 0) {
      onChangeCurrentPage(1)
    } else if (pageNumber > _total) {
      onChangeCurrentPage(_total)
    } else {
      onChangeCurrentPage(pageNumber)
    }
  }

  const goNext = () => setCurrentPage(currentPage + 1)
  const goPrevious = () => setCurrentPage(currentPage - 1)
  const goFirst = () => setCurrentPage(1)
  const goLast = () => setCurrentPage(_total)

  const tokens = useMemo(
    (): Token[] =>
      computePaginationTokens({
        totalPages: _total,
        currentPage,
        siblings,
        boundaries,
      }),
    [_total, boundaries, currentPage, siblings],
  )

  return {
    tokens,
    currentPage,
    setCurrentPage,
    goNext,
    goPrevious,
    goFirst,
    goLast: goLast,
  }
}

export {
  usePagination,
  type UsePaginationOptions,
  type UsePaginationReturnValue,
}
