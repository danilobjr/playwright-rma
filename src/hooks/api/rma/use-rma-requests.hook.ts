import { queryOptions, useQuery } from '@tanstack/react-query'

import {
  getRmaRequestById,
  listRmaRequests,
  peekNextRmaId,
} from '@/services/api/rma/rma-request.service'

const rmaRequestsQueryKey = ['rma-requests'] as const
const nextRmaIdQueryKey = ['rma-requests', 'next-rma-id'] as const
const rmaRequestQueryKey = (rmaId: string) => ['rma-requests', rmaId] as const

const rmaRequestsQueryOptions = queryOptions({
  queryKey: rmaRequestsQueryKey,
  queryFn: listRmaRequests,
})

const nextRmaIdQueryOptions = queryOptions({
  queryKey: nextRmaIdQueryKey,
  queryFn: peekNextRmaId,
})

const rmaRequestQueryOptions = (rmaId: string) =>
  queryOptions({
    queryKey: rmaRequestQueryKey(rmaId),
    queryFn: () => getRmaRequestById(rmaId),
  })

function useRmaRequests() {
  return useQuery(rmaRequestsQueryOptions)
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
  useNextRmaId,
  useRmaRequest,
  useRmaRequests,
}
