import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Plus, RotateCcwIcon, TrashIcon } from 'lucide-react'

import {
  RMA_STATUS_DISPLAY,
  RMA_STATUS_ORDER,
} from '@/pages/rma/rma-status-presentation.model'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTablePagination } from '@/components/ui/data-table'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  rmaListDefaultPagination,
  type RmaListFilters,
  type RmaListPagination,
} from '@/services/api/rma/rma-request.service'
import type { RmaRequest } from '@/models/rma-request.model'
import { formatDate } from '@/utils/date-time/format-date.util'

import { rmaListDefaultFormFilterValues } from './components/form/rma-list-filters-default'
import { RmaListFiltersForm } from './components/form/rma-list-filters-form.component'

const tableLinkClassName =
  'rounded-sm text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

type RmaListPageProps = {
  requests?: ReadonlyArray<RmaRequest>
  isPending?: boolean
  isError?: boolean
  error?: Error | null
  filters?: RmaListFilters
  pagination?: RmaListPagination
  onDeleteRequest: (rmaId: string) => Promise<void> | void
  onFiltersFormSubmit: (filters: RmaListFilters) => void
  onPaginationChange: (pagination: RmaListPagination) => void
}

function RmaListPage({
  error,
  isError,
  isPending,
  filters = rmaListDefaultFormFilterValues,
  pagination = rmaListDefaultPagination,
  requests = [],
  onDeleteRequest,
  onFiltersFormSubmit,
  onPaginationChange,
}: RmaListPageProps) {
  const [requestPendingDelete, setRequestPendingDelete] = useState<
    RmaRequest | undefined
  >()

  const statusCounts = RMA_STATUS_ORDER.reduce(
    (counts, status) => ({
      ...counts,
      [status]: requests.filter((request) => request.status === status).length,
    }),
    {
      Pending: 0,
      Approved: 0,
      Completed: 0,
    },
  )

  function resetFilters() {
    onFiltersFormSubmit(rmaListDefaultFormFilterValues)
  }

  async function confirmDeleteRequest() {
    if (!requestPendingDelete) {
      return
    }

    await onDeleteRequest(requestPendingDelete.rmaId)
    setRequestPendingDelete(undefined)
  }

  function renderDeleteAction(request: RmaRequest) {
    if (!onDeleteRequest) {
      return null
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Delete request"
            size="icon-sm"
            type="button"
            variant="destructive"
            onClick={() => setRequestPendingDelete(request)}
          >
            <TrashIcon data-icon="inline-start" />
            <span className="sr-only">Delete request</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete request</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <TooltipProvider>
      <div className="grid gap-4">
        <section
          aria-label="RMA status summary"
          className="grid grid-cols-4 gap-3"
        >
          <div
            aria-label="Total RMAs summary"
            className="flex flex-col gap-3.5 rounded-xl border bg-card p-4.5 text-sm"
            role="article"
          >
            <span className="text-[1.75rem] leading-none font-bold tabular-nums">
              {pagination.totalRows}
            </span>
            <span className="text-[0.8125rem] leading-none font-medium text-muted-foreground">
              Total RMAs
            </span>
          </div>
          {RMA_STATUS_ORDER.filter((s) => s !== 'Rejected').map((status) => {
            const presentation = RMA_STATUS_DISPLAY[status]

            return (
              <div
                key={status}
                aria-label={`${status} summary`}
                className="flex flex-col gap-3.5 rounded-xl border bg-card p-4.5 text-sm"
                role="article"
              >
                <span className="text-[1.75rem] leading-none font-bold tabular-nums">
                  {statusCounts[status]}
                </span>
                <span className="text-[0.8125rem] leading-none font-medium text-muted-foreground">
                  {presentation.label}
                </span>
              </div>
            )
          })}
        </section>

        {isPending ? (
          <Card>
            <CardContent className="grid gap-4 pt-(--card-spacing)">
              <div aria-hidden="true">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-(--card-spacing)">
                        RMA ID
                      </TableHead>
                      <TableHead className="bg-muted/50">
                        Customer name
                      </TableHead>
                      <TableHead className="bg-muted/50">Product ID</TableHead>
                      <TableHead className="bg-muted/50">Reason</TableHead>
                      <TableHead className="bg-muted/50">Status</TableHead>
                      <TableHead className="bg-muted/50">
                        Submitted date
                      </TableHead>
                      <TableHead className="bg-muted/50 pr-(--card-spacing)">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="pl-(--card-spacing)">
                          <Skeleton
                            className="h-4 w-28"
                            data-testid="rma-list-skeleton"
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-36" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-60" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="pr-(--card-spacing)">
                          <Skeleton className="h-8 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn&apos;t load RMA Requests</AlertTitle>
            <AlertDescription>{error?.message}</AlertDescription>
          </Alert>
        ) : pagination.totalRows === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No RMA Requests</EmptyTitle>
              <EmptyDescription>
                Create an RMA Request to start tracking returns.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/rma/create">
                  <Plus aria-hidden="true" />
                  New RMA
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : requests.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No RMA Requests found</EmptyTitle>
              <EmptyDescription>Try adjusting your filters.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={resetFilters}>
                <RotateCcwIcon aria-hidden="true" />
                Reset filters
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <RmaListFiltersForm
              values={filters}
              onSubmit={onFiltersFormSubmit}
            />

            <Card className="gap-0 p-0">
              <CardContent className="grid gap-4 p-0">
                <div>
                  <Table aria-label="RMA Requests">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-muted/50 pl-(--card-spacing) text-[0.8125rem] text-muted-foreground">
                          RMA ID
                        </TableHead>
                        <TableHead className="bg-muted/50 text-[0.8125rem] text-muted-foreground">
                          Customer name
                        </TableHead>
                        <TableHead className="bg-muted/50 text-[0.8125rem] text-muted-foreground">
                          Product ID
                        </TableHead>
                        <TableHead className="bg-muted/50 text-[0.8125rem] text-muted-foreground">
                          Reason
                        </TableHead>
                        <TableHead className="bg-muted/50 text-[0.8125rem] text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="bg-muted/50 text-[0.8125rem] text-muted-foreground">
                          Submitted date
                        </TableHead>
                        <TableHead className="bg-muted/50 pr-(--card-spacing) text-[0.8125rem] text-muted-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => {
                        const presentation = RMA_STATUS_DISPLAY[request.status]
                        const updateLink = {
                          params: { rmaId: request.rmaId },
                          to: '/rma/$rmaId' as const,
                        }

                        return (
                          <TableRow key={request.rmaId}>
                            <TableCell className="pl-(--card-spacing)">
                              <Link
                                className={tableLinkClassName}
                                {...updateLink}
                              >
                                {request.rmaId}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                className={tableLinkClassName}
                                {...updateLink}
                              >
                                {request.customerName}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                className={tableLinkClassName}
                                {...updateLink}
                              >
                                {request.productId}
                              </Link>
                            </TableCell>
                            <TableCell className="max-w-80 whitespace-normal">
                              <Link
                                className={tableLinkClassName}
                                {...updateLink}
                              >
                                {request.reason}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                className={tableLinkClassName}
                                {...updateLink}
                              >
                                <Badge
                                  className={presentation.className}
                                  variant="outline"
                                >
                                  {presentation.label}
                                </Badge>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                className={tableLinkClassName}
                                {...updateLink}
                              >
                                {formatDate(new Date(request.createdAt))}
                              </Link>
                            </TableCell>
                            <TableCell className="pr-(--card-spacing)">
                              {renderDeleteAction(request)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <DataTablePagination
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              totalRows={pagination.totalRows}
              onChangePagination={(value) =>
                onPaginationChange({ ...pagination, ...value })
              }
            />
          </>
        )}
      </div>
      <AlertDialog
        open={Boolean(requestPendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setRequestPendingDelete(undefined)
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete RMA Request?</AlertDialogTitle>
            <AlertDialogDescription>
              {requestPendingDelete
                ? `This will remove RMA Request ${requestPendingDelete.rmaId} for ${requestPendingDelete.customerName} from the list. You cannot restore it after deleting.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(event) => {
                event.preventDefault()
                void confirmDeleteRequest()
              }}
            >
              Delete request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}

export type { RmaListFilters }

export { RmaListPage }
