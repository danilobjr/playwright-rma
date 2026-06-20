import { SaveIcon } from 'lucide-react'

import {
  RMA_STATUS_ORDER,
  RMA_STATUS_PRESENTATION,
} from '@/pages/rma/rma-status-presentation.model'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { RmaRequest } from '@/services/api/rma/rma-request.model'
import { cn } from '@/utils/styles/cn.util'

type RmaUpdatePageProps = {
  request?: RmaRequest
  isPending?: boolean
  isError?: boolean
  error?: Error | null
}

function formatSubmittedDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function RmaUpdateSkeleton() {
  return (
    <Card
      aria-label="Loading RMA Request"
      role="article"
      className="mx-auto w-full max-w-3xl"
    >
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-2">
            <Skeleton className="h-7 w-44" data-testid="rma-update-skeleton" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 pt-(--card-spacing)">
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-2 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-6"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
        <Separator />
        <FieldGroup>
          <Field>
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-10 w-full" />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end border-t">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </CardFooter>
    </Card>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-6">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}

function RmaUpdatePage({ isPending, request }: RmaUpdatePageProps) {
  if (isPending) {
    return <RmaUpdateSkeleton />
  }

  if (!request) {
    return null
  }

  const submittedDate = formatSubmittedDate(new Date(request.createdAt))
  const statusPresentation = RMA_STATUS_PRESENTATION[request.status]
  const StatusIcon = statusPresentation.icon

  return (
    <Card
      aria-label={`RMA Request ${request.rmaId}`}
      role="article"
      className="mx-auto w-full max-w-3xl"
    >
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1.5">
            <CardTitle>
              <h2>{request.rmaId}</h2>
            </CardTitle>
            <CardDescription>Submitted {submittedDate}</CardDescription>
          </div>
          <Badge
            className={cn('border', statusPresentation.className)}
            variant="outline"
          >
            {statusPresentation.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 pt-(--card-spacing)">
        <dl className="grid gap-4">
          <DetailRow label="RMA ID" value={request.rmaId} />
          <DetailRow label="Customer name" value={request.customerName} />
          <DetailRow label="Product ID" value={request.productId} />
          <DetailRow label="Reason" value={request.reason} />
          <DetailRow label="Submitted date" value={submittedDate} />
        </dl>
        <Separator />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="rma-status">Status</FieldLabel>
            <Select value={request.status}>
              <SelectTrigger
                id="rma-status"
                aria-label="Status"
                className="!h-10 w-full"
              >
                <span className="flex items-center gap-2">
                  <StatusIcon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  <span>{statusPresentation.label}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {RMA_STATUS_ORDER.map((status) => {
                    const presentation = RMA_STATUS_PRESENTATION[status]
                    const Icon = presentation.icon

                    return (
                      <SelectItem
                        key={status}
                        textValue={presentation.label}
                        value={status}
                      >
                        <Icon aria-hidden="true" />
                        <span className="grid gap-0.5">
                          <span>{presentation.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {presentation.description}
                          </span>
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end border-t">
        <Button variant="outline">Cancel</Button>
        <Button>
          <SaveIcon aria-hidden="true" />
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}

export { RmaUpdatePage }
