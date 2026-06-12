import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLayout } from '@/components/app/layout/use-layout.hook'

import { RmaListPage } from './rma-list.page'

function RmaListContainer() {
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

  return <RmaListPage />
}

export { RmaListContainer }
