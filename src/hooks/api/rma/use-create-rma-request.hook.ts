import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createRmaRequest } from '@/services/api/rma/rma-request.service'

import { nextRmaIdQueryKey, rmaRequestsQueryKey } from './use-rma-requests.hook'

function useCreateRmaRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRmaRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: rmaRequestsQueryKey }),
        queryClient.invalidateQueries({ queryKey: nextRmaIdQueryKey }),
      ])
    },
  })
}

export { useCreateRmaRequest }
