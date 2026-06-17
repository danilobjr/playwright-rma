import { useState } from 'react'
import {
  CalendarIcon,
  ClipboardListIcon,
  RotateCcwIcon,
  SearchIcon,
} from 'lucide-react'

import {
  RMA_STATUS_ORDER,
  RMA_STATUS_PRESENTATION,
} from '@/pages/rma/rma-status-presentation.model'
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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { RmaRequest } from '@/services/api/rma/rma-request.model'
import { cn } from '@/utils/styles/cn.util'

const ALL_STATUSES = 'All'

const STATUS_FILTER_OPTIONS = [ALL_STATUSES, ...RMA_STATUS_ORDER] as const

type StatusFilterValue = (typeof STATUS_FILTER_OPTIONS)[number]

type RmaListFilters = {
  search: string
  status: StatusFilterValue
  submittedDate?: Date
}

type RmaListPageProps = {
  requests: RmaRequest[]
}

const defaultFilters: RmaListFilters = {
  search: '',
  status: ALL_STATUSES,
}

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
    const statusMatches =
      filters.status === ALL_STATUSES || request.status === filters.status

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

function RmaListPage({ requests }: RmaListPageProps) {
  const [draftFilters, setDraftFilters] =
    useState<RmaListFilters>(defaultFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<RmaListFilters>(defaultFilters)
  const [selectedSummaryStatus, setSelectedSummaryStatus] = useState<
    StatusFilterValue | undefined
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
  }

  function resetFilters() {
    setDraftFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
    setSelectedSummaryStatus(undefined)
  }

  function applySummaryFilter(status: StatusFilterValue) {
    const nextFilters = {
      ...draftFilters,
      status,
    }

    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
    setSelectedSummaryStatus(status)
  }

  return (
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
            onClick={() => applySummaryFilter(ALL_STATUSES)}
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
                onClick={() => applySummaryFilter(status)}
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
                      updateDraftFilters({ search: event.currentTarget.value })
                    }
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="rma-status-filter">Status</FieldLabel>
                <Select
                  value={draftFilters.status}
                  onValueChange={(status: StatusFilterValue) =>
                    updateDraftFilters({ status })
                  }
                >
                  <SelectTrigger
                    id="rma-status-filter"
                    aria-label="Status"
                    className="h-10 w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {STATUS_FILTER_OPTIONS.map((status) => {
                        if (status === ALL_STATUSES) {
                          return (
                            <SelectItem key={status} value={status}>
                              <ClipboardListIcon aria-hidden="true" />
                              <span className="grid gap-0.5">
                                <span>All</span>
                                <span className="text-xs text-muted-foreground">
                                  All active RMA Requests
                                </span>
                              </span>
                            </SelectItem>
                          )
                        }

                        const presentation = RMA_STATUS_PRESENTATION[status]
                        const Icon = presentation.icon

                        return (
                          <SelectItem key={status} value={status}>
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
                        !draftFilters.submittedDate && 'text-muted-foreground',
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
              <TooltipProvider>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Search"
                        className="size-10"
                        type="button"
                        onClick={applyFilters}
                      >
                        <SearchIcon aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Search</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Reset"
                        className="size-10"
                        type="button"
                        variant="outline"
                        onClick={resetFilters}
                      >
                        <RotateCcwIcon aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {displayedRequests.length === 0 ? (
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
          {displayedRequests.map((request) => {
            const presentation = RMA_STATUS_PRESENTATION[request.status]

            return (
              <Card
                key={request.rmaId}
                aria-label={request.rmaId}
                role="article"
                size="sm"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <CardTitle>
                        <h3>{request.rmaId}</h3>
                      </CardTitle>
                      <CardDescription>{request.customerName}</CardDescription>
                    </div>
                    <Badge className={presentation.className} variant="outline">
                      {presentation.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm md:grid-cols-4">
                  <div>
                    <span className="font-medium">Product ID</span>
                    <p className="text-muted-foreground">{request.productId}</p>
                  </div>
                  <div>
                    <span className="font-medium">Submitted Date</span>
                    <p className="text-muted-foreground">
                      {formatSubmittedDate(new Date(request.createdAt))}
                    </p>
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

export type { RmaListPageProps }

export { RmaListPage }
