import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLayout } from '@/components/app/layout/use-layout.hook'

import { RmaCreatePage } from './rma-create.page'

function RmaCreateContainer() {
  useLayout({
    breadcrumbs: ['RMA', 'New request'],
    title: 'Create RMA Request',
    description: 'Use a compact FieldGroup form layout that matches shadcn form composition.',
    topRightAction: (
      <Button asChild variant="outline">
        <Link to="/rma">
          <ArrowLeft aria-hidden="true" />
          Back to list
        </Link>
      </Button>
    ),
  })

  return (
    <RmaCreatePage
      cancelAction={
        <Button asChild type="button" variant="outline">
          <Link to="/rma">Cancel</Link>
        </Button>
      }
    />
  )
}

export { RmaCreateContainer }
