import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { useLayout } from '@/components/app/layout/use-layout.hook'
import { Button } from '@/components/ui/button'
import { useRmaRequest } from '@/hooks/api/rma/use-rma-requests.hook'
import { useUpdateRmaRequest } from '@/hooks/api/rma/use-update-rma-request.hook'
import type { RmaStatus } from '@/services/api/rma/rma-request.model'

import { RmaUpdatePage } from './rma-update.page'

type RmaUpdateContainerProps = {
  rmaId: string
}

function RmaUpdateContainer({ rmaId }: RmaUpdateContainerProps) {
  const navigate = useNavigate()
  const rmaRequestQuery = useRmaRequest(rmaId)
  const updateRmaRequestMutation = useUpdateRmaRequest()
  const [draftStatus, setDraftStatus] = useState<RmaStatus | undefined>()

  const currentDraft = draftStatus ?? rmaRequestQuery.data?.status

  useLayout(
    {
      breadcrumbs: ['RMA', rmaId],
      title: 'Update RMA Status',
      description: 'Review the request and choose the next workflow status.',
      topRightAction: (
        <Button asChild variant="outline">
          <Link to="/rma">
            <ArrowLeft aria-hidden="true" />
            Back to requests
          </Link>
        </Button>
      ),
    },
    [rmaId],
  )

  async function handleSave() {
    if (!currentDraft) return

    try {
      await updateRmaRequestMutation.mutateAsync({
        rmaId,
        input: { status: currentDraft },
      })
    } catch {
      return
    }

    toast.success('RMA request status updated')
    await navigate({ to: '/rma' })
  }

  function handleCancel() {
    navigate({ to: '/rma' })
  }

  const persistedStatus = rmaRequestQuery.data?.status
  const saveDisabled = !persistedStatus || currentDraft === persistedStatus

  return (
    <RmaUpdatePage
      error={rmaRequestQuery.error}
      isError={rmaRequestQuery.isError}
      isPending={rmaRequestQuery.isPending}
      onRetry={() => rmaRequestQuery.refetch()}
      request={rmaRequestQuery.data ?? undefined}
      draftStatus={currentDraft}
      onStatusChange={setDraftStatus}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={updateRmaRequestMutation.isPending}
      saveError={updateRmaRequestMutation.error?.message}
      saveDisabled={saveDisabled}
    />
  )
}

export { RmaUpdateContainer }
