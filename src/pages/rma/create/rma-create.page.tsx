import type { ReactNode } from 'react'
import { Check, Info } from 'lucide-react'

import { Button } from '@/components/ui/button'

type RmaCreatePageProps = {
  cancelAction: ReactNode
}

function RmaCreatePage({ cancelAction }: RmaCreatePageProps) {
  return (
    <section className="flex justify-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border bg-card text-card-foreground">
        <div className="border-b p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Request details</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            RMA ID is generated automatically. Status starts as Pending.
          </p>
        </div>
        <div className="flex flex-col gap-5 p-6">
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-sm font-medium">RMA ID</span>
              <div className="h-10 rounded-lg border bg-background" />
            </div>
            <div className="flex w-56 flex-col gap-2">
              <span className="text-sm font-medium">Status</span>
              <div className="h-10 rounded-lg border bg-background" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-sm font-medium">Customer Name</span>
              <div className="h-10 rounded-lg border bg-background" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-sm font-medium">Product ID</span>
              <div className="h-10 rounded-lg border bg-background" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Reason</span>
            <div className="h-32 rounded-lg border bg-background" />
            <p className="text-xs text-muted-foreground">
              Include condition, defect details, and customer-provided notes.
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border bg-muted p-3.5 text-sm text-muted-foreground">
            <Info aria-hidden="true" className="size-4 shrink-0" />
            <p>
              Submitting this form creates a Pending RMA and returns the user to the request list.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t p-6">
          {cancelAction}
          <Button type="button">
            <Check aria-hidden="true" />
            Submit
          </Button>
        </div>
      </div>
    </section>
  )
}

export { RmaCreatePage }
