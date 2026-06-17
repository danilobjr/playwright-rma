import { ClipboardListIcon } from 'lucide-react'

import {
  RMA_STATUS_ORDER,
  RMA_STATUS_PRESENTATION,
} from '@/pages/rma/rma-status-presentation.model'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { RmaRequest } from '@/services/api/rma/rma-request.model'
import { cn } from '@/utils/styles/cn.util'

type RmaListPageProps = {
  requests: RmaRequest[]
}

function RmaListPage({ requests }: RmaListPageProps) {
  const statusCounts = RMA_STATUS_ORDER.reduce(
    (counts, status) => ({
      ...counts,
      [status]: requests.filter((request) => request.status === status).length,
    }),
    {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
      Completed: 0,
    },
  )

  return (
    <div className="grid gap-4">
      <section
        aria-label="RMA status summary"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
      >
        <Card aria-label="Total RMAs summary" role="article" size="sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle>
                  <h3>Total RMAs</h3>
                </CardTitle>
                <CardDescription>All active RMA Requests</CardDescription>
              </div>
              <ClipboardListIcon
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {requests.length}
            </p>
          </CardContent>
        </Card>
        {RMA_STATUS_ORDER.map((status) => {
          const presentation = RMA_STATUS_PRESENTATION[status]
          const Icon = presentation.icon

          return (
            <Card
              key={status}
              aria-label={`${status} summary`}
              className={cn('border', presentation.className)}
              role="article"
              size="sm"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle>
                      <h3>{presentation.label}</h3>
                    </CardTitle>
                    <CardDescription>
                      {presentation.description}
                    </CardDescription>
                  </div>
                  <Icon aria-hidden="true" className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">
                  {statusCounts[status]}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {requests.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No RMA Requests</CardTitle>
            <CardDescription>
              Create an RMA Request to start tracking returns.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <section className="grid gap-3">
          {requests.map((request) => {
            const presentation = RMA_STATUS_PRESENTATION[request.status]

            return (
              <Card key={request.rmaId} size="sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <CardTitle>{request.rmaId}</CardTitle>
                      <CardDescription>{request.customerName}</CardDescription>
                    </div>
                    <Badge className={presentation.className} variant="outline">
                      {presentation.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm md:grid-cols-3">
                  <div>
                    <span className="font-medium">Product ID</span>
                    <p className="text-muted-foreground">{request.productId}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Reason</span>
                    <p className="text-muted-foreground">{request.reason}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}
    </div>
  )
}

export { RmaListPage }
