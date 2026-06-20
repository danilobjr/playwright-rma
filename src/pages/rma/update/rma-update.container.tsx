import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { useLayout } from '@/components/app/layout/use-layout.hook'
import { Button } from '@/components/ui/button'
import { useRmaRequest } from '@/hooks/api/rma/use-rma-requests.hook'

import { RmaUpdatePage } from './rma-update.page'

type RmaUpdateContainerProps = {
  rmaId: string
}

function RmaUpdateContainer({ rmaId }: RmaUpdateContainerProps) {
  const rmaRequestQuery = useRmaRequest(rmaId)

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

  return (
    <RmaUpdatePage
      error={rmaRequestQuery.error}
      isError={rmaRequestQuery.isError}
      isPending={rmaRequestQuery.isPending}
      onRetry={() => rmaRequestQuery.refetch()}
      request={rmaRequestQuery.data}
    />
  )
}

export { RmaUpdateContainer }
