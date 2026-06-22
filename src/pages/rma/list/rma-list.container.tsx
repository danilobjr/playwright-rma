import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { useLayout } from '@/components/app/layout/use-layout.hook'
import { successToast } from '@/components/app/toast.util'
import { Button } from '@/components/ui/button'
import { useDeleteRmaRequest } from '@/hooks/api/rma/use-delete-rma-request.hook'
import { useRmaRequests } from '@/hooks/api/rma/use-rma-requests.hook'

import { RmaListPage } from './rma-list.page'

function RmaListContainer() {
  const rmaRequestsQuery = useRmaRequests()
  const deleteRmaRequestMutation = useDeleteRmaRequest()

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

  return (
    <RmaListPage
      error={rmaRequestsQuery.error}
      isError={rmaRequestsQuery.isError}
      isPending={rmaRequestsQuery.isPending}
      requests={rmaRequestsQuery.data ?? []}
      onDeleteRequest={deleteRequest}
    />
  )
}

export { RmaListContainer }
