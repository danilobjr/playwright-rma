import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { useLayout } from '@/components/app/layout/use-layout.hook'
import { successToast } from '@/components/app/toast.util'
import { Button } from '@/components/ui/button'
import { useDeleteRmaRequest } from '@/hooks/api/rma/use-delete-rma-request.hook'
import { useRmaRequests } from '@/hooks/api/rma/use-rma-requests.hook'
import { type RmaListPagination } from '@/services/api/rma/rma-request.service'

import { rmaListDefaultFormFilterValues } from './components/form/rma-list-default-form-filters-values'
import { RmaListPage, type RmaListFilters } from './rma-list.page'

function RmaListContainer() {
  const [filters, setFilters] = useState<RmaListFilters>(
    rmaListDefaultFormFilterValues,
  )
  const [pagination, setPagination] = useState<RmaListPagination>()
  const rmaRequestsQuery = useRmaRequests(filters, pagination)
  const deleteRmaRequestMutation = useDeleteRmaRequest()

  useEffect(() => {
    const queryData = rmaRequestsQuery.data

    if (queryData && !pagination) {
      const { data: _, ...p } = queryData
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPagination(p)
    }
  }, [rmaRequestsQuery.data, pagination])

  useLayout(
    {
      breadcrumbs: ['Operations', 'RMA'],
      title: 'RMA Requests',
      description:
        'Track return merchandise authorizations, filter by status and date, and start new requests.',
      topRightAction: (
        <Button asChild>
          <Link to="/rma/create">
            <Plus aria-hidden="true" />
            New RMA
          </Link>
        </Button>
      ),
    },
    [],
  )

  async function deleteRequest(rmaId: string) {
    await deleteRmaRequestMutation.mutateAsync(rmaId)
    successToast('RMA deleted', 'The request was removed.')
  }

  function handleFiltersFormSubmit(updatedFilters: RmaListFilters) {
    setFilters((oldValue) => ({ ...oldValue, ...updatedFilters }))
  }

  function handlePaginationChange(updatedPagination: RmaListPagination) {
    setPagination((oldValue) => ({ ...oldValue, ...updatedPagination }))
  }

  return (
    <RmaListPage
      error={rmaRequestsQuery.error}
      isError={rmaRequestsQuery.isError}
      isPending={rmaRequestsQuery.isFetching}
      filters={filters}
      pagination={pagination}
      requests={rmaRequestsQuery.data?.data}
      onDeleteRequest={deleteRequest}
      onPaginationChange={handlePaginationChange}
      onFiltersFormSubmit={handleFiltersFormSubmit}
    />
  )
}

export { RmaListContainer }
