import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import { rmaListDefaultFormFilterValues } from '@/pages/rma/list/components/form/rma-list-default-form-filters-values'
import {
  getRmaRequestById,
  listRmaRequests,
  peekNextRmaId,
  rmaListDefaultPagination,
  type RmaListBody,
} from '@/services/api/rma/rma-request.service'

const rmaRequestsQueryKey = ['rma-requests'] as const
const rmaRequestsWithPaginationQueryKey = (
  filters?: RmaListBody['filters'],
  pagination?: RmaListBody['pagination'],
) => ['rma-requests', { filters, pagination }] as const
const nextRmaIdQueryKey = ['rma-requests', 'next-rma-id'] as const
const rmaRequestQueryKey = (rmaId: string) => ['rma-requests', rmaId] as const

const nextRmaIdQueryOptions = queryOptions({
  queryKey: nextRmaIdQueryKey,
  queryFn: peekNextRmaId,
})

const rmaRequestQueryOptions = (rmaId: string) =>
  queryOptions({
    queryKey: rmaRequestQueryKey(rmaId),
    queryFn: async () => {
      const result = await getRmaRequestById(rmaId)
      return result ?? null
    },
  })

function useRmaRequests(
  filters = rmaListDefaultFormFilterValues,
  pagination = rmaListDefaultPagination,
) {
  return useQuery({
    queryKey: rmaRequestsWithPaginationQueryKey(filters, pagination),
    queryFn: () => listRmaRequests({ filters, pagination }),
    placeholderData: keepPreviousData,
  })
}

function useNextRmaId() {
  return useQuery(nextRmaIdQueryOptions)
}

function useRmaRequest(rmaId: string) {
  return useQuery(rmaRequestQueryOptions(rmaId))
}

export {
  nextRmaIdQueryKey,
  rmaRequestQueryKey,
  rmaRequestsQueryKey,
  rmaRequestsWithPaginationQueryKey,
  useNextRmaId,
  useRmaRequest,
  useRmaRequests,
}
