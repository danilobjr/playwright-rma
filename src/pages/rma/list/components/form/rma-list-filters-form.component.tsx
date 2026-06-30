import { useState } from 'react'
import { CalendarIcon, RotateCcwIcon, SearchIcon } from 'lucide-react'

import {
  RMA_STATUS_DISPLAY,
  RMA_STATUS_ORDER,
} from '@/pages/rma/rma-status-presentation.model'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import type { RmaListFilters } from '@/services/api/rma/rma-request.service'
import type { RmaStatus } from '@/models/rma-request.model'
import { formatDate } from '@/utils/date-time/format-date.util'
import { cn } from '@/utils/styles/cn.util'

import { rmaListDefaultFormFilterValues } from './rma-list-filters-default'

type FilterProp = keyof RmaListFilters

type RmaListFiltersFormProps = {
  values?: RmaListFilters
  onSubmit?: (values: RmaListFilters) => void
}

const STATUS_FILTER_OPTIONS = RMA_STATUS_ORDER

function RmaListFiltersForm({
  values = rmaListDefaultFormFilterValues,
  onSubmit = () => {},
}: RmaListFiltersFormProps) {
  const [innerValues, setInnerValues] = useState<RmaListFilters>(() => values)

  function handleInputChange(
    field: FilterProp,
    value: RmaListFilters[typeof field],
  ) {
    setInnerValues({ ...values, [field]: value })
  }

  function submit() {
    onSubmit(innerValues)
  }

  function reset() {
    onSubmit({ ...rmaListDefaultFormFilterValues })
  }

  return (
    <div className="p-(--card-spacing)">
      <FieldGroup>
        <div className="grid grid-cols-4 items-end gap-3">
          <Field>
            <FieldLabel htmlFor="rma-search">Search</FieldLabel>
            <div className="relative">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                className="bg-card pl-9"
                id="rma-search"
                placeholder="Search RMA Requests"
                value={innerValues.search}
                onChange={(e) =>
                  handleInputChange('search', e.currentTarget.value)
                }
              />
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="rma-status-filter">Status</FieldLabel>
            {/* // TODO replace this with a AppInputSelectRmaRequestStatus */}
            <Select
              value={innerValues.status}
              onValueChange={(status: RmaStatus) =>
                handleInputChange('status', status)
              }
            >
              <SelectTrigger
                id="rma-status-filter"
                aria-label="Status"
                className="w-full bg-card"
              >
                {innerValues.status ? (
                  <span className="flex items-center gap-2">
                    {(() => {
                      const presentation =
                        RMA_STATUS_DISPLAY[innerValues.status]
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
                  <SelectValue placeholder="All" />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {STATUS_FILTER_OPTIONS.map((status) => {
                    const presentation = RMA_STATUS_DISPLAY[status]
                    const Icon = presentation.icon

                    return (
                      <SelectItem
                        key={status}
                        textValue={presentation.label}
                        value={status}
                      >
                        <div className="flex gap-2">
                          <Icon className="mt-0.5" aria-hidden="true" />
                          <span className="grid gap-0.5">
                            <span>{presentation.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {presentation.description}
                            </span>
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Submitted date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  aria-label="Submitted date"
                  className={cn(
                    'w-full justify-start bg-card text-left font-normal hover:bg-card aria-expanded:bg-card',
                  )}
                  variant="outline"
                >
                  <CalendarIcon
                    className="text-muted-foreground"
                    aria-hidden="true"
                  />
                  {innerValues.submittedDate ? (
                    formatDate(innerValues.submittedDate)
                  ) : (
                    <span className="text-muted-foreground">All</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={innerValues.submittedDate}
                  onSelect={(value) =>
                    handleInputChange('submittedDate', value)
                  }
                />
              </PopoverContent>
            </Popover>
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              aria-label="Reset"
              className="gap-2 bg-card"
              type="button"
              variant="outline"
              onClick={reset}
            >
              <RotateCcwIcon aria-hidden="true" />
              <span>Reset</span>
            </Button>

            <Button aria-label="Search" type="button" onClick={submit}>
              <SearchIcon aria-hidden="true" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </FieldGroup>
    </div>
  )
}

export { RmaListFiltersForm }
