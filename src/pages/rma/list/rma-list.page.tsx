import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  Plus,
  RotateCcwIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react'

import {
  RMA_STATUS_ORDER,
  RMA_STATUS_PRESENTATION,
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
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import type {
  RmaRequest,
  RmaStatus,
} from '@/services/api/rma/rma-request.model'
import { cn } from '@/utils/styles/cn.util'

const ALL_STATUSES = 'All'
const ROWS_PER_PAGE = 10

const STATUS_FILTER_OPTIONS = RMA_STATUS_ORDER

type StatusFilterValue = RmaStatus | ''
type SummaryStatusValue = RmaStatus | typeof ALL_STATUSES

type RmaListFilters = {
  search: string
  status: StatusFilterValue
  submittedDate?: Date
}

type RmaListPageProps = {
  onDeleteRequest?: (rmaId: string) => Promise<void> | void
  requests: RmaRequest[]
  isPending?: boolean
  isError?: boolean
  error?: Error | null
}

const defaultFilters: RmaListFilters = {
  search: '',
  status: '',
}

const tableLinkClassName =
  'rounded-sm text-foreground no-underline transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

function normalizeFilterText(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

function hasSameLocalCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function matchesSearch(request: RmaRequest, search: string) {
  const normalizedSearch = normalizeFilterText(search)

  if (!normalizedSearch) {
    return true
  }

  return [
    request.rmaId,
    request.customerName,
    request.productId,
    request.reason,
  ].some((value) => normalizeFilterText(value).includes(normalizedSearch))
}

function matchesSubmittedDate(request: RmaRequest, submittedDate?: Date) {
  if (!submittedDate) {
    return true
  }

  return hasSameLocalCalendarDay(new Date(request.createdAt), submittedDate)
}

function filterRmaRequests(requests: RmaRequest[], filters: RmaListFilters) {
  return requests.filter((request) => {
    const statusMatches = !filters.status || request.status === filters.status

    return (
      statusMatches &&
      matchesSearch(request, filters.search) &&
      matchesSubmittedDate(request, filters.submittedDate)
    )
  })
}

function sortRmaRequestsBySubmittedDateDesc(requests: RmaRequest[]) {
  return [...requests].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )
}

function formatSubmittedDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function RmaListPage({
  error,
  isError,
  isPending,
  onDeleteRequest,
  requests,
}: RmaListPageProps) {
  const [draftFilters, setDraftFilters] =
    useState<RmaListFilters>(defaultFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<RmaListFilters>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSummaryStatus, setSelectedSummaryStatus] = useState<
    SummaryStatusValue | undefined
  >()
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
      Rejected: 0,
      Completed: 0,
    },
  )
  const sortedRequests = sortRmaRequestsBySubmittedDateDesc(requests)
  const displayedRequests = filterRmaRequests(sortedRequests, appliedFilters)
  const pageCount = Math.max(
    1,
    Math.ceil(displayedRequests.length / ROWS_PER_PAGE),
  )
  const safeCurrentPage = Math.min(currentPage, pageCount)
  const paginatedRequests = displayedRequests.slice(
    (safeCurrentPage - 1) * ROWS_PER_PAGE,
    safeCurrentPage * ROWS_PER_PAGE,
  )
  const visibleRangeStart =
    displayedRequests.length === 0
      ? 0
      : (safeCurrentPage - 1) * ROWS_PER_PAGE + 1
  const visibleRangeEnd = Math.min(
    safeCurrentPage * ROWS_PER_PAGE,
    displayedRequests.length,
  )
  const defaultCalendarMonth = sortedRequests[0]
    ? new Date(sortedRequests[0].createdAt)
    : new Date()

  function updateDraftFilters(nextFilters: Partial<RmaListFilters>) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
    }))
    setSelectedSummaryStatus(undefined)
  }

  function applyFilters() {
    setAppliedFilters(draftFilters)
    setCurrentPage(1)
  }

  function resetFilters() {
    setDraftFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
    setSelectedSummaryStatus(undefined)
    setCurrentPage(1)
  }

  function applyTotalSummaryFilter() {
    setDraftFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
    setSelectedSummaryStatus(ALL_STATUSES)
    setCurrentPage(1)
  }

  function applyStatusSummaryFilter(status: RmaStatus) {
    const nextFilters: RmaListFilters = {
      ...defaultFilters,
      status,
    }

    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
    setSelectedSummaryStatus(status)
    setCurrentPage(1)
  }

  async function confirmDeleteRequest() {
    if (!requestPendingDelete || !onDeleteRequest) {
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
            size="sm"
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
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
        >
          <Card aria-label="Total RMAs summary" role="article" size="sm">
            <button
              aria-label="Total RMAs summary"
              aria-pressed={selectedSummaryStatus === ALL_STATUSES}
              className="grid w-full gap-3 text-left"
              type="button"
              onClick={applyTotalSummaryFilter}
            >
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
            </button>
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
                <button
                  aria-label={`${status} summary`}
                  aria-pressed={selectedSummaryStatus === status}
                  className="grid w-full gap-3 text-left"
                  type="button"
                  onClick={() => applyStatusSummaryFilter(status)}
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
                </button>
              </Card>
            )
          })}
        </section>

        <Card>
          <CardContent className="pt-(--card-spacing)">
            <FieldGroup>
              <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_220px_240px_auto] lg:items-end">
                <Field>
                  <FieldLabel htmlFor="rma-search">Search</FieldLabel>
                  <div className="relative">
                    <SearchIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      className="h-10 pl-9"
                      id="rma-search"
                      placeholder="Search RMA Requests"
                      value={draftFilters.search}
                      onChange={(event) =>
                        updateDraftFilters({
                          search: event.currentTarget.value,
                        })
                      }
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="rma-status-filter">Status</FieldLabel>
                  <Select
                    value={draftFilters.status}
                    onValueChange={(status: RmaStatus) =>
                      updateDraftFilters({ status })
                    }
                  >
                    <SelectTrigger
                      id="rma-status-filter"
                      aria-label="Status"
                      className="!h-10 w-full"
                    >
                      {draftFilters.status ? (
                        <span className="flex items-center gap-2">
                          {(() => {
                            const presentation =
                              RMA_STATUS_PRESENTATION[draftFilters.status]
                            const Icon = presentation.icon

                            return (
                              <>
                                <Icon
                                  aria-hidden="true"
                                  className="size-4 text-muted-foreground"
                                />
                                <span>{presentation.label}</span>
                              </>
                            )
                          })()}
                        </span>
                      ) : (
                        <SelectValue placeholder="Status" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {STATUS_FILTER_OPTIONS.map((status) => {
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
                <Field>
                  <FieldLabel>Submitted Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        aria-label="Submitted Date"
                        className={cn(
                          'h-10 w-full justify-start text-left font-normal',
                          !draftFilters.submittedDate &&
                            'text-muted-foreground',
                        )}
                        variant="outline"
                      >
                        <CalendarIcon aria-hidden="true" />
                        {draftFilters.submittedDate
                          ? formatSubmittedDate(draftFilters.submittedDate)
                          : 'Submitted Date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        defaultMonth={defaultCalendarMonth}
                        selected={draftFilters.submittedDate}
                        onSelect={(submittedDate) =>
                          updateDraftFilters({ submittedDate })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Search"
                        className="h-10 flex-1 gap-2 lg:size-10 lg:flex-none lg:px-0"
                        type="button"
                        onClick={applyFilters}
                      >
                        <SearchIcon aria-hidden="true" />
                        <span className="lg:sr-only">Search</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Search</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Reset"
                        className="h-10 flex-1 gap-2 lg:size-10 lg:flex-none lg:px-0"
                        type="button"
                        variant="outline"
                        onClick={resetFilters}
                      >
                        <RotateCcwIcon aria-hidden="true" />
                        <span className="lg:sr-only">Reset</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {isPending ? (
          <Card>
            <CardContent className="grid gap-4 pt-(--card-spacing)">
              <div aria-hidden="true" className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RMA ID</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
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
                        <TableCell>
                          <Skeleton className="h-8 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div aria-hidden="true" className="grid gap-3 md:hidden">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Card key={index} size="sm">
                    <CardContent className="grid gap-3 pt-(--card-spacing)">
                      <div className="grid gap-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="grid gap-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <div className="grid gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn&apos;t load RMA Requests</AlertTitle>
            <AlertDescription>{error?.message}</AlertDescription>
          </Alert>
        ) : displayedRequests.length === 0 ? (
          requests.length === 0 ? (
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
          ) : (
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
          )
        ) : (
          <Card>
            <CardContent className="grid gap-4 pt-(--card-spacing)">
              <div className="hidden md:block">
                <Table aria-label="RMA Requests">
                  <TableHeader>
                    <TableRow>
                      <TableHead>RMA ID</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.map((request) => {
                      const presentation =
                        RMA_STATUS_PRESENTATION[request.status]
                      const updateLink = {
                        params: { rmaId: request.rmaId },
                        to: '/rma/$rmaId' as const,
                      }

                      return (
                        <TableRow key={request.rmaId}>
                          <TableCell className="font-medium">
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
                            {formatSubmittedDate(new Date(request.createdAt))}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button asChild size="sm" variant="outline">
                                <Link {...updateLink}>Update</Link>
                              </Button>
                              {renderDeleteAction(request)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <div aria-label="RMA Requests" className="grid gap-3 md:hidden">
                {paginatedRequests.map((request) => {
                  const presentation = RMA_STATUS_PRESENTATION[request.status]
                  const submittedDate = formatSubmittedDate(
                    new Date(request.createdAt),
                  )
                  const updateLink = {
                    params: { rmaId: request.rmaId },
                    to: '/rma/$rmaId' as const,
                  }

                  return (
                    <Card
                      key={request.rmaId}
                      aria-label={`RMA Request ${request.rmaId}`}
                      role="article"
                      size="sm"
                    >
                      <CardContent className="grid gap-3 pt-(--card-spacing)">
                        <div className="grid gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            RMA ID
                          </span>
                          <Link
                            className={cn(tableLinkClassName, 'font-medium')}
                            {...updateLink}
                          >
                            {request.rmaId}
                          </Link>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Customer Name
                          </span>
                          <Link className={tableLinkClassName} {...updateLink}>
                            {request.customerName}
                          </Link>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Product ID
                          </span>
                          <Link className={tableLinkClassName} {...updateLink}>
                            {request.productId}
                          </Link>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Reason
                          </span>
                          <Link className={tableLinkClassName} {...updateLink}>
                            {request.reason}
                          </Link>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Status
                          </span>
                          <Link className={tableLinkClassName} {...updateLink}>
                            <Badge
                              className={presentation.className}
                              variant="outline"
                            >
                              {presentation.label}
                            </Badge>
                          </Link>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Submitted Date
                          </span>
                          <span>{submittedDate}</span>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Actions
                          </span>
                          <div className="flex gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link {...updateLink}>Update</Link>
                            </Button>
                            {renderDeleteAction(request)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {visibleRangeStart}-{visibleRangeEnd} of{' '}
                  {displayedRequests.length}
                </p>
                <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        aria-label="Go to previous page"
                        disabled={safeCurrentPage === 1}
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentPage(safeCurrentPage - 1)}
                      >
                        <ChevronLeftIcon data-icon="inline-start" />
                        Previous
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button
                        aria-label="Go to next page"
                        disabled={safeCurrentPage === pageCount}
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentPage(safeCurrentPage + 1)}
                      >
                        Next
                        <ChevronRightIcon data-icon="inline-end" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
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

export type { RmaListPageProps }

export { RmaListPage }
