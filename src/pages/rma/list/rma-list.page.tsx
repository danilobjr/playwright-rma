import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { RmaRequest } from '@/services/api/rma/rma-request.model'

type RmaListPageProps = {
  requests: RmaRequest[]
}

function RmaListPage({ requests }: RmaListPageProps) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No RMA Requests</CardTitle>
          <CardDescription>
            Create an RMA Request to start tracking returns.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <section className="grid gap-3">
      {requests.map((request) => (
        <Card key={request.rmaId} size="sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>{request.rmaId}</CardTitle>
                <CardDescription>{request.customerName}</CardDescription>
              </div>
              <Badge variant="secondary">{request.status}</Badge>
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
      ))}
    </section>
  )
}

export { RmaListPage }
