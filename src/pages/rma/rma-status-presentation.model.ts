import {
  CalendarClockIcon,
  CheckIcon,
  PackageCheckIcon,
  XIcon,
  type LucideIcon,
} from 'lucide-react'

import type { RmaStatus } from '@/services/api/rma/rma-request.model'

type RmaStatusPresentation = {
  label: RmaStatus
  description: string
  icon: LucideIcon
  className: string
}

const RMA_STATUS_ORDER = [
  'Pending',
  'Approved',
  'Rejected',
  'Completed',
] as const satisfies RmaStatus[]

const RMA_STATUS_PRESENTATION: Record<RmaStatus, RmaStatusPresentation> = {
  Pending: {
    label: 'Pending',
    description: 'Awaiting review',
    icon: CalendarClockIcon,
    className:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300',
  },
  Approved: {
    label: 'Approved',
    description: 'Authorized for return',
    icon: CheckIcon,
    className:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300',
  },
  Rejected: {
    label: 'Rejected',
    description: 'Declined request',
    icon: XIcon,
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  },
  Completed: {
    label: 'Completed',
    description: 'Return workflow closed',
    icon: PackageCheckIcon,
    className:
      'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300',
  },
}

export { RMA_STATUS_ORDER, RMA_STATUS_PRESENTATION }
export type { RmaStatusPresentation }
