import { Link } from '@tanstack/react-router'
import { SaveIcon } from 'lucide-react'

import { RMA_STATUS_DISPLAY } from '@/pages/rma/rma-status-presentation.model'
import { AppStatusSwitcher } from '@/components/app/app-status-switcher.app'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardContentProps,
  type CardFooterProps,
  type CardHeaderProps,
  type CardProps,
} from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { RmaRequest, RmaStatus } from '@/models/rma-request.model'
import { cn } from '@/utils/styles/cn.util'

type RmaUpdatePageProps = {
  request?: RmaRequest
  isPending?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  draftStatus?: RmaStatus
  onStatusChange?: (status: RmaStatus) => void
  onSave?: () => void
  onCancel?: () => void
  isSaving?: boolean
  saveError?: string
  saveDisabled?: boolean
}

function formatSubmittedDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function RmaInfoCard(props: CardProps) {
  return (
    <Card
      className="mx-auto w-full max-w-190 gap-6 overflow-hidden rounded-xl p-0"
      role="article"
      {...props}
    />
  )
}

function RmaInfoCardHeader(props: CardHeaderProps) {
  return <CardHeader className="border-b p-6" {...props} />
}

function RmaInfoCardContent(props: CardContentProps) {
  return <CardContent className="grid gap-6 px-6" {...props} />
}

function RmaInfoCardFooter(props: CardFooterProps) {
  return (
    <CardFooter
      className="flex-col-reverse items-stretch justify-end gap-3 border-t p-6 sm:flex-row sm:items-center sm:gap-4"
      {...props}
    />
  )
}

function RmaUpdateSkeleton() {
  return (
    <RmaInfoCard aria-label="Loading RMA Request">
      <RmaInfoCardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-2">
            <Skeleton className="h-7 w-44" data-testid="rma-update-skeleton" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      </RmaInfoCardHeader>
      <RmaInfoCardContent>
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
      </RmaInfoCardContent>
      <RmaInfoCardFooter>
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </RmaInfoCardFooter>
    </RmaInfoCard>
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

function RmaUpdatePage({
  isPending,
  isError,
  request,
  onRetry,
  draftStatus,
  onStatusChange,
  onSave,
  onCancel,
  isSaving = false,
  saveError,
  saveDisabled = true,
}: RmaUpdatePageProps) {
  if (isPending) {
    return <RmaUpdateSkeleton />
  }

  if (isError) {
    return (
      <RmaInfoCard aria-label="Unable to load RMA request">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <h2 className="font-heading text-sm font-medium tracking-tight">
            Unable to load RMA request
          </h2>
          <p className="text-sm text-muted-foreground">
            Try again or return to the request list.
          </p>
          <div className="mt-2 flex gap-2">
            <Button onClick={onRetry}>Try again</Button>
            <Button asChild variant="outline">
              <Link to="/rma">Back to requests</Link>
            </Button>
          </div>
        </CardContent>
      </RmaInfoCard>
    )
  }

  if (!request) {
    return (
      <RmaInfoCard aria-label="RMA request not found">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <h2 className="font-heading text-sm font-medium tracking-tight">
            RMA request not found
          </h2>
          <p className="text-sm text-muted-foreground">
            Check the RMA ID or return to the request list.
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link to="/rma">Back to requests</Link>
          </Button>
        </CardContent>
      </RmaInfoCard>
    )
  }

  const currentDraft = draftStatus ?? request.status
  const submittedDate = formatSubmittedDate(new Date(request.createdAt))
  const persistedPresentation = RMA_STATUS_DISPLAY[request.status]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div className="grid grid-cols-3 gap-5">
        <RmaInfoCard
          className="col-span-2"
          aria-label={`RMA Request ${request.rmaId}`}
        >
          <RmaInfoCardHeader className="border-b p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="grid gap-1.5">
                <CardTitle>
                  <h2>{request.rmaId}</h2>
                </CardTitle>
                <CardDescription>Submitted {submittedDate}</CardDescription>
              </div>
              <Badge
                className={cn('border', persistedPresentation.className)}
                variant="outline"
              >
                {persistedPresentation.label}
              </Badge>
            </div>
          </RmaInfoCardHeader>
          <RmaInfoCardContent>
            {saveError && (
              <Alert variant="destructive">
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}
            <dl className="grid gap-4">
              <DetailRow label="RMA ID" value={request.rmaId} />
              <DetailRow label="Customer name" value={request.customerName} />
              <DetailRow label="Product ID" value={request.productId} />
              <DetailRow label="Reason" value={request.reason} />
              <DetailRow label="Submitted date" value={submittedDate} />
            </dl>
          </RmaInfoCardContent>
        </RmaInfoCard>

        <div>
          <AppStatusSwitcher status={currentDraft} onChange={onStatusChange} />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button className="bg-white" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={saveDisabled || isSaving} onClick={onSave}>
          <SaveIcon aria-hidden="true" />
          Save
        </Button>
      </div>
    </div>
  )
}

export { RmaUpdatePage }
