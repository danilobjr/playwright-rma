import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteRmaRequest } from '@/services/api/rma/rma-request.service'

import { nextRmaIdQueryKey, rmaRequestsQueryKey } from './use-rma-requests.hook'

function useDeleteRmaRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRmaRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: rmaRequestsQueryKey }),
        queryClient.invalidateQueries({ queryKey: nextRmaIdQueryKey }),
      ])
    },
  })
}

export { useDeleteRmaRequest }
