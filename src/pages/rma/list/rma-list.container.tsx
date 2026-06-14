import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { useLayout } from '@/components/app/layout/use-layout.hook'
import { Button } from '@/components/ui/button'
import { useRmaRequests } from '@/hooks/api/rma/use-rma-requests.hook'

import { RmaListPage } from './rma-list.page'

function RmaListContainer() {
  const rmaRequestsQuery = useRmaRequests()

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

  return <RmaListPage requests={rmaRequestsQuery.data ?? []} />
}

export { RmaListContainer }
