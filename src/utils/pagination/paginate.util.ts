import type { Pagination } from '@/components/ui/data-table/pagination.type'

function paginate<T>(items: T[], pagination: Pagination<T>): T[] {
  return items
    .sort((a, b) => {
      const sortProp = pagination.sortProp
      const direction = pagination.direction

      if (!sortProp || !direction) {
        return 0
      }

      const aValue = a[sortProp]
      const bValue = b[sortProp]

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1
      }

      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1
      }

      return 0
    })
    .slice(
      pagination.pageIndex * pagination.pageSize,
      pagination.pageIndex * pagination.pageSize + pagination.pageSize,
    )
}

export { paginate }
