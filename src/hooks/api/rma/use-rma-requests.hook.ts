import { queryOptions, useQuery } from '@tanstack/react-query'

import {
  listRmaRequests,
  peekNextRmaId,
} from '@/services/api/rma/rma-request.service'

const rmaRequestsQueryKey = ['rma-requests'] as const
const nextRmaIdQueryKey = ['rma-requests', 'next-rma-id'] as const

const rmaRequestsQueryOptions = queryOptions({
  queryKey: rmaRequestsQueryKey,
  queryFn: listRmaRequests,
})

const nextRmaIdQueryOptions = queryOptions({
  queryKey: nextRmaIdQueryKey,
  queryFn: peekNextRmaId,
})

function useRmaRequests() {
  return useQuery(rmaRequestsQueryOptions)
}

function useNextRmaId() {
  return useQuery(nextRmaIdQueryOptions)
}

export { nextRmaIdQueryKey, rmaRequestsQueryKey, useNextRmaId, useRmaRequests }
