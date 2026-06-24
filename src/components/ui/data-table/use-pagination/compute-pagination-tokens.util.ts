import { range as rangeUtil } from '@/utils/arrays/range.util'
import { clamp } from '@/utils/numbers/clamp.util'

const DOTS = 'DOTS'

type Token = number | typeof DOTS

function range(start: number, end: number) {
  const length = end - start + 1
  if (length <= 0) {
    return []
  }

  return rangeUtil(length, start)
}

type ComputePaginationTokensOptions = {
  totalPages: number
  siblings?: number
  boundaries?: number
  currentPage: number
}
function computePaginationTokens({
  totalPages,
  siblings = 1,
  boundaries = 1,
  currentPage,
}: ComputePaginationTokensOptions): Token[] {
  const _total = clamp(Math.trunc(totalPages), { min: 0 })

  if (_total === 0) {
    return []
  }

  const totalPageNumbers = siblings * 2 + 3 + boundaries * 2
  if (totalPageNumbers >= _total) {
    return range(1, _total)
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, boundaries)
  const rightSiblingIndex = Math.min(
    currentPage + siblings,
    _total - boundaries,
  )

  const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
  const shouldShowRightDots = rightSiblingIndex < _total - (boundaries + 1)

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = siblings * 2 + boundaries + 2
    return [
      ...range(1, leftItemCount),
      DOTS,
      ...range(_total - (boundaries - 1), _total),
    ]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = boundaries + 1 + 2 * siblings
    return [
      ...range(1, boundaries),
      DOTS,
      ...range(_total - rightItemCount, _total),
    ]
  }

  return [
    ...range(1, boundaries),
    DOTS,
    ...range(leftSiblingIndex, rightSiblingIndex),
    DOTS,
    ...range(_total - boundaries + 1, _total),
  ]
}

export { computePaginationTokens, DOTS, type Token }
