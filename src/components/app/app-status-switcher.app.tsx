import {
  ArrowDownIcon,
  CalendarClockIcon,
  CheckIcon,
  PackageCheckIcon,
  XIcon,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { RmaStatus } from '@/models/rma-request.model'
import { cn } from '@/utils/styles/cn.util'

function getNextStatuses(currentStatus: RmaStatus): RmaStatus[] {
  switch (currentStatus) {
    case 'Pending':
      return ['Approved', 'Rejected']
    case 'Approved':
      return ['Completed']
    default:
      return []
  }
}

function getPastStatuses(currentStatus: RmaStatus): RmaStatus[] {
  switch (currentStatus) {
    case 'Pending':
      return []
    case 'Approved':
    case 'Rejected':
      return ['Pending']
    case 'Completed':
      return ['Pending', 'Approved']
    default:
      return []
  }
}

const STATUS_CONFIG: Record<
  RmaStatus,
  {
    label: string
    icon: React.ElementType
    colorClass: string
    bgClass: string
    ringClass: string
    borderClass: string
    dotBg: string
  }
> = {
  Pending: {
    label: 'Pending',
    icon: CalendarClockIcon,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
    ringClass: 'ring-amber-300',
    borderClass: 'border-amber-300',
    dotBg: 'bg-amber-500',
  },
  Approved: {
    label: 'Approved',
    icon: CheckIcon,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    ringClass: 'ring-emerald-300',
    borderClass: 'border-emerald-300',
    dotBg: 'bg-emerald-500',
  },
  Rejected: {
    label: 'Rejected',
    icon: XIcon,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50',
    ringClass: 'ring-rose-300',
    borderClass: 'border-rose-300',
    dotBg: 'bg-rose-500',
  },
  Completed: {
    label: 'Completed',
    icon: PackageCheckIcon,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
    ringClass: 'ring-indigo-300',
    borderClass: 'border-indigo-300',
    dotBg: 'bg-indigo-500',
  },
}

type StatusHistory = {
  status: RmaStatus
  completedAt?: string
}

type AppStatusSwitcherOptionProps = {
  state: 'past' | 'active' | 'future' | 'disabled'
  status: RmaStatus
  onSelect?: () => void
}

function AppStatusSwitcherOption({
  status,
  state,
  onSelect,
}: AppStatusSwitcherOptionProps) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  const isClickable = state === 'future'

  return (
    <button
      onClick={isClickable ? onSelect : undefined}
      disabled={!isClickable}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200',
        state === 'active' &&
          cn('border-2', cfg.borderClass, cfg.bgClass, 'shadow-sm'),
        state === 'future' &&
          'cursor-pointer border-border bg-card hover:border-muted-foreground/30 hover:shadow-sm',
        state === 'past' && 'cursor-default border-border bg-muted/40',
        state === 'disabled' &&
          'cursor-not-allowed border-border/40 bg-muted/20 opacity-40',
      )}
    >
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200',
          state === 'active' && cn(cfg.dotBg, 'text-white'),
          state === 'past' && 'bg-muted-foreground/20 text-muted-foreground',
          state === 'future' &&
            'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20',
          state === 'disabled' && 'bg-muted text-muted-foreground',
        )}
      >
        <Icon
          className={cn(
            'shrink-0 text-white transition-all duration-200',
            state === 'past' && 'text-muted-foreground',
            state === 'future' &&
              'text-muted-foreground/40 group-hover:text-muted-foreground',
            state === 'disabled' && 'text-muted-foreground/30',
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-sm font-semibold',
            state === 'active' && cfg.colorClass,
            state === 'past' && 'text-muted-foreground line-through',
            state === 'future' &&
              'text-foreground/60 group-hover:text-foreground',
            state === 'disabled' && 'text-muted-foreground',
          )}
        >
          {cfg.label}
        </span>
      </div>
    </button>
  )
}

type AppStatusSwitcherProps = Pick<AppStatusSwitcherOptionProps, 'status'> & {
  status?: RmaStatus
  initialHistory?: StatusHistory[]
  onChange?: (status: RmaStatus) => void
}

function AppStatusSwitcher({
  status,
  onChange = () => {},
}: AppStatusSwitcherProps) {
  const pastStatuses = getPastStatuses(status)
  const nextStatuses = getNextStatuses(status)

  const getState = (
    _status: RmaStatus,
  ): 'past' | 'active' | 'future' | 'disabled' => {
    if (_status === status) {
      return 'active'
    }
    if (pastStatuses.includes(_status)) {
      return 'past'
    }
    if (nextStatuses.includes(_status)) {
      return 'future'
    }
    return 'disabled'
  }

  return (
    <Card>
      <CardHeader className="border-b px-5 pt-5 pb-3">
        <CardTitle>Status</CardTitle>
        <CardDescription>Select new RMA status</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 px-3 py-3">
        <AppStatusSwitcherOption
          status="Pending"
          state={getState('Pending')}
          onSelect={() => onChange('Pending')}
        />

        <div className="flex items-center gap-2 px-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            {status === 'Pending' ? (
              'Available to choose'
            ) : (
              <ArrowDownIcon className="size-3" />
            )}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <AppStatusSwitcherOption
            status="Approved"
            state={getState('Approved')}
            onSelect={() => onChange('Approved')}
          />
          <AppStatusSwitcherOption
            status="Rejected"
            state={getState('Rejected')}
            onSelect={() => onChange('Rejected')}
          />
        </div>

        <div className="flex items-center gap-2 px-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            {status === 'Pending' ? (
              'Available after Approved'
            ) : status === 'Approved' ? (
              'Available to choose'
            ) : status === 'Rejected' ? (
              'Unavailable'
            ) : (
              <ArrowDownIcon className="size-3" />
            )}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <AppStatusSwitcherOption
          status="Completed"
          state={getState('Completed')}
          onSelect={() => onChange('Completed')}
        />
      </CardContent>
    </Card>
  )
}

export { AppStatusSwitcher }
