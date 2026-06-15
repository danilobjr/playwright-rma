import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { useLayout } from '@/components/app/layout/use-layout.hook'
import { Button } from '@/components/ui/button'
import { useCreateRmaRequest } from '@/hooks/api/rma/use-create-rma-request.hook'
import { useNextRmaId } from '@/hooks/api/rma/use-rma-requests.hook'
import type { RmaStatus } from '@/services/api/rma/rma-request.model'
import { DuplicateRmaRequestError } from '@/services/api/rma/rma-request.service'

import type { RmaCreateFormValues } from './rma-create-form.model'
import { RmaCreatePage } from './rma-create.page'

function RmaCreateContainer() {
  const navigate = useNavigate()
  const [duplicateAlert, setDuplicateAlert] = useState<
    | {
        matchingRmaId: string
        matchingStatus: RmaStatus
      }
    | undefined
  >()
  const createRmaRequestMutation = useCreateRmaRequest()
  const nextRmaIdQuery = useNextRmaId()

  useLayout(
    {
      breadcrumbs: ['RMA', 'New request'],
      title: 'Create RMA Request',
      description:
        'Use a compact FieldGroup form layout that matches shadcn form composition.',
      topRightAction: (
        <Button asChild variant="outline">
          <Link to="/rma">
            <ArrowLeft aria-hidden="true" />
            Back to list
          </Link>
        </Button>
      ),
    },
    [],
  )

  async function handleSubmit(values: RmaCreateFormValues) {
    setDuplicateAlert(undefined)

    try {
      await createRmaRequestMutation.mutateAsync(values)
    } catch (error) {
      if (error instanceof DuplicateRmaRequestError) {
        setDuplicateAlert({
          matchingRmaId: error.matchingRmaId,
          matchingStatus: error.matchingStatus,
        })
        return
      }

      throw error
    }

    toast.success('RMA request created')
    await navigate({ to: '/rma' })
  }

  const submitError =
    createRmaRequestMutation.error instanceof DuplicateRmaRequestError
      ? undefined
      : createRmaRequestMutation.error?.message

  return (
    <RmaCreatePage
      cancelAction={
        <Button asChild type="button" variant="outline">
          <Link to="/rma">Cancel</Link>
        </Button>
      }
      duplicateAlert={duplicateAlert}
      isSubmitting={createRmaRequestMutation.isPending}
      nextRmaId={nextRmaIdQuery.data ?? 'RMA-2026-1001'}
      submitError={submitError}
      onDuplicateFieldsChange={() => setDuplicateAlert(undefined)}
      onSubmit={handleSubmit}
    />
  )
}

export { RmaCreateContainer }
