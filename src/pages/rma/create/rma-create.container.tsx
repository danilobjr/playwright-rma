import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { useLayout } from '@/components/app/layout/use-layout.hook'
import { Button } from '@/components/ui/button'
import { useCreateRmaRequest } from '@/hooks/api/rma/use-create-rma-request.hook'
import { useNextRmaId } from '@/hooks/api/rma/use-rma-requests.hook'

import type { RmaCreateFormValues } from './rma-create-form.model'
import { RmaCreatePage } from './rma-create.page'

function RmaCreateContainer() {
  const navigate = useNavigate()
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
    await createRmaRequestMutation.mutateAsync(values)
    toast.success('RMA request created')
    await navigate({ to: '/rma' })
  }

  return (
    <RmaCreatePage
      cancelAction={
        <Button asChild type="button" variant="outline">
          <Link to="/rma">Cancel</Link>
        </Button>
      }
      isSubmitting={createRmaRequestMutation.isPending}
      nextRmaId={nextRmaIdQuery.data ?? 'RMA-2026-1001'}
      submitError={createRmaRequestMutation.error?.message}
      onSubmit={handleSubmit}
    />
  )
}

export { RmaCreateContainer }
