import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateRmaRequestInput } from '@/services/api/rma/rma-request.model'
import { updateRmaRequest } from '@/services/api/rma/rma-request.service'

import {
  rmaRequestQueryKey,
  rmaRequestsQueryKey,
} from './use-rma-requests.hook'

function useUpdateRmaRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      rmaId,
      input,
    }: {
      rmaId: string
      input: UpdateRmaRequestInput
    }) => updateRmaRequest(rmaId, input),
    onSuccess: async (_data, { rmaId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: rmaRequestsQueryKey }),
        queryClient.invalidateQueries({ queryKey: rmaRequestQueryKey(rmaId) }),
      ])
    },
  })
}

export { useUpdateRmaRequest }
