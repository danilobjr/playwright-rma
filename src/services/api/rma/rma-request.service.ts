import type { Pagination } from '@/components/ui/data-table/pagination.type'
import type { PaginatedData } from '@/models/paginated-data.model'
import type {
  CreateRmaRequestInput,
  RmaRequest,
  RmaStatus,
  UpdateRmaRequestInput,
} from '@/models/rma-request.model'
import { paginate } from '@/utils/pagination/paginate.util'
import { waitBetween } from '@/utils/timing/wait-between.util'

const RMA_STORAGE_KEY = 'playwright-rma:rma-requests:v1'
const RMA_ID_SEQUENCE_KEY = 'playwright-rma:rma-id-sequence:v1'
const RMA_ID_START_SEQUENCE = 1001
const PENDING_STATUS = 'Pending'

type StoredRmaRequests = RmaRequest[] | { requests: RmaRequest[] }

type RmaIdSequence = {
  year: number
  nextSequence: number
}

class DuplicateRmaRequestError extends Error {
  matchingRmaId: string
  matchingStatus: RmaStatus

  constructor(request: RmaRequest) {
    super('Duplicate RMA Request')
    this.name = 'DuplicateRmaRequestError'
    this.matchingRmaId = request.rmaId
    this.matchingStatus = request.status
  }
}

const seedRmaRequests: RmaRequest[] = [
  {
    rmaId: 'RMA-2026-1001',
    status: 'Pending',
    customerName: 'Avery Stone',
    productId: 'PRD-7F2A',
    reason: 'Display panel intermittently turns black during use.',
    createdAt: '2026-01-15T14:05:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1002',
    status: 'Approved',
    customerName: 'Mina Patel',
    productId: 'PRD-9C4D',
    reason: 'Battery does not hold charge longer than thirty minutes.',
    createdAt: '2026-02-08T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1003',
    status: 'Approved',
    customerName: 'Noah Kim',
    productId: 'PRD-5E6F',
    reason: 'Device overheats after 20 minutes of use.',
    createdAt: '2026-03-01T11:00:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1004',
    status: 'Rejected',
    customerName: 'Jordan Lee',
    productId: 'PRD-A1B2',
    reason: 'Screen flickers after startup.',
    createdAt: '2026-03-04T10:30:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1005',
    status: 'Completed',
    customerName: 'Sam Rivera',
    productId: 'PRD-3C8D',
    reason: 'USB port no longer detects any connected device.',
    createdAt: '2026-03-10T08:45:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1006',
    status: 'Pending',
    customerName: 'Taylor Chen',
    productId: 'PRD-2B4A',
    reason: 'Headphone jack outputs static noise on left channel.',
    createdAt: '2026-03-12T16:20:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1007',
    status: 'Pending',
    customerName: 'Morgan Wright',
    productId: 'PRD-8F1C',
    reason: 'Wi-Fi antenna disconnects randomly requiring reboot.',
    createdAt: '2026-03-15T09:30:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1008',
    status: 'Approved',
    customerName: 'Casey Johnson',
    productId: 'PRD-4D9E',
    reason: 'Keyboard backlight stopped working after firmware update.',
    createdAt: '2026-03-18T14:10:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1009',
    status: 'Pending',
    customerName: 'Riley Thompson',
    productId: 'PRD-6A3B',
    reason: 'Camera lens fails to focus on objects closer than one meter.',
    createdAt: '2026-03-20T11:45:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1010',
    status: 'Completed',
    customerName: 'Jamie Davis',
    productId: 'PRD-7C5D',
    reason: 'Power button requires excessive force to register press.',
    createdAt: '2026-03-22T15:00:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1011',
    status: 'Approved',
    customerName: 'Quinn Martinez',
    productId: 'PRD-9E2A',
    reason: 'Bluetooth pairing fails after device enters sleep mode.',
    createdAt: '2026-03-25T10:20:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1012',
    status: 'Pending',
    customerName: 'Drew Anderson',
    productId: 'PRD-1F8B',
    reason: 'Volume rocker switches become unresponsive intermittently.',
    createdAt: '2026-03-28T13:15:00.000Z',
  },
]

function normalizeRequiredText(value: string, label: string) {
  const normalized = value.trim().replace(/\s+/g, ' ')

  if (!normalized) {
    throw new Error(`${label} is required`)
  }

  return normalized
}

function normalizeProductId(value: string) {
  const productId = normalizeRequiredText(value, 'Product ID').toUpperCase()

  if (!/^PRD-[A-Z0-9]{4}$/.test(productId)) {
    throw new Error('Product ID must match PRD-XXXX')
  }

  return productId
}

function normalizeReason(value: string) {
  const reason = normalizeRequiredText(value, 'Reason')

  if (reason.length < 10) {
    throw new Error('Reason must be at least 10 characters')
  }

  if (reason.length > 255) {
    throw new Error('Reason must be at most 255 characters')
  }

  return reason
}

function normalizeDuplicateText(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

function hasSameLocalCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function hasSameDuplicateFields(
  input: CreateRmaRequestInput,
  request: RmaRequest,
) {
  return (
    normalizeDuplicateText(input.customerName) ===
      normalizeDuplicateText(request.customerName) &&
    normalizeDuplicateText(input.productId) ===
      normalizeDuplicateText(request.productId) &&
    normalizeDuplicateText(input.reason) ===
      normalizeDuplicateText(request.reason)
  )
}

function findDuplicateRmaRequest(
  input: CreateRmaRequestInput,
  requests: RmaRequest[],
  createdAt: Date,
) {
  return requests.find((request) => {
    if (!hasSameDuplicateFields(input, request)) {
      return false
    }

    if (request.status === PENDING_STATUS) {
      return true
    }

    return hasSameLocalCalendarDay(new Date(request.createdAt), createdAt)
  })
}

function readActiveRmaRequests() {
  const stored = localStorage.getItem(RMA_STORAGE_KEY)

  if (!stored) {
    return [...seedRmaRequests]
  }

  const parsed = JSON.parse(stored) as StoredRmaRequests

  if (Array.isArray(parsed)) {
    return [...seedRmaRequests, ...parsed]
  }

  return parsed.requests
}

function writeActiveRmaRequests(requests: RmaRequest[]) {
  localStorage.setItem(RMA_STORAGE_KEY, JSON.stringify({ requests }))
}

function readRmaIdSequence(): RmaIdSequence | null {
  const stored = localStorage.getItem(RMA_ID_SEQUENCE_KEY)

  if (!stored) {
    return null
  }

  return JSON.parse(stored) as RmaIdSequence
}

function writeRmaIdSequence(sequence: RmaIdSequence) {
  localStorage.setItem(RMA_ID_SEQUENCE_KEY, JSON.stringify(sequence))
}

function getAllRmaRequests() {
  return readActiveRmaRequests()
}

function getCurrentYear() {
  return new Date().getFullYear()
}

function getNextRmaId(requests: RmaRequest[]) {
  const currentYear = getCurrentYear()
  const currentYearSequences = requests.flatMap((request) => {
    const match = request.rmaId.match(/^RMA-(\d{4})-(\d+)$/)

    if (!match || Number(match[1]) !== currentYear) {
      return []
    }

    return [Number(match[2])]
  })
  const fromActive =
    Math.max(RMA_ID_START_SEQUENCE - 1, ...currentYearSequences) + 1

  const persisted = readRmaIdSequence()
  const fromPersisted =
    persisted && persisted.year === currentYear
      ? persisted.nextSequence
      : RMA_ID_START_SEQUENCE

  const nextSequence = Math.max(fromActive, fromPersisted)

  return `RMA-${currentYear}-${nextSequence}`
}

async function withRmaApiDelay<T>(operation: () => T | Promise<T>) {
  await waitBetween()

  return operation()
}

type RmaListPagination = Pagination<RmaRequest>
type RmaListPaginated = PaginatedData<RmaRequest>
type RmaListFilters = {
  search: string
  status: RmaStatus | ''
  submittedDate?: Date
}

type RmaListBody = {
  filters: RmaListFilters
  pagination: RmaListPagination
}

const rmaListDefaultPagination: RmaListPagination = {
  sortProp: 'createdAt',
  direction: 'desc',
  pageIndex: 0,
  pageSize: 10,
}

async function listRmaRequests(body: RmaListBody): Promise<RmaListPaginated> {
  const allRequests = await withRmaApiDelay(() => getAllRmaRequests())
  const totalRows = allRequests.length

  let requests = [...allRequests]

  if (body.filters.search) {
    const search = body.filters.search.toLowerCase()
    requests = requests.filter((request) =>
      Object.values(request).some((value) =>
        String(value).toLowerCase().includes(search),
      ),
    )
  }

  if (body.filters.status) {
    requests = requests.filter(
      (request) => request.status === body.filters.status,
    )
  }

  if (body.filters.submittedDate) {
    const submittedDate = body.filters.submittedDate
    requests = requests.filter((request) =>
      hasSameLocalCalendarDay(new Date(request.createdAt), submittedDate),
    )
  }

  const pagination = body.pagination

  const data = paginate(requests, pagination)

  return {
    data,
    totalRows,
    ...pagination,
  }
}

async function getRmaRequestById(rmaId: string) {
  return withRmaApiDelay(() =>
    getAllRmaRequests().find((request) => request.rmaId === rmaId),
  )
}

async function peekNextRmaId() {
  return withRmaApiDelay(() => getNextRmaId(getAllRmaRequests()))
}

async function createRmaRequest(input: CreateRmaRequestInput) {
  const createdAt = new Date()

  return withRmaApiDelay(() => {
    const existingRequests = readActiveRmaRequests()
    const duplicateRequest = findDuplicateRmaRequest(
      input,
      existingRequests,
      createdAt,
    )

    if (duplicateRequest) {
      throw new DuplicateRmaRequestError(duplicateRequest)
    }

    const request: RmaRequest = {
      rmaId: getNextRmaId(existingRequests),
      status: PENDING_STATUS,
      customerName: normalizeRequiredText(input.customerName, 'Customer name'),
      productId: normalizeProductId(input.productId),
      reason: normalizeReason(input.reason),
      createdAt: createdAt.toISOString(),
    }

    writeActiveRmaRequests([...existingRequests, request])

    const currentYear = getCurrentYear()
    const requestSequence = Number(request.rmaId.split('-')[2])
    writeRmaIdSequence({ year: currentYear, nextSequence: requestSequence + 1 })

    return request
  })
}

async function deleteRmaRequest(rmaId: string) {
  return withRmaApiDelay(() => {
    const existingRequests = readActiveRmaRequests()
    const deletedRequest = existingRequests.find(
      (request) => request.rmaId === rmaId,
    )

    if (!deletedRequest) {
      throw new Error('RMA Request not found')
    }

    writeActiveRmaRequests(
      existingRequests.filter((request) => request.rmaId !== rmaId),
    )

    return deletedRequest
  })
}

async function updateRmaRequest(rmaId: string, input: UpdateRmaRequestInput) {
  return withRmaApiDelay(() => {
    const existingRequests = readActiveRmaRequests()
    const requestIndex = existingRequests.findIndex(
      (request) => request.rmaId === rmaId,
    )

    if (requestIndex === -1) {
      throw new Error('RMA request not found')
    }

    const updatedRequest: RmaRequest = {
      ...existingRequests[requestIndex],
      status: input.status,
    }

    const nextRequests = [...existingRequests]
    nextRequests[requestIndex] = updatedRequest
    writeActiveRmaRequests(nextRequests)

    return updatedRequest
  })
}

export type { RmaListFilters, RmaListPagination, RmaListPaginated, RmaListBody }

export {
  createRmaRequest,
  deleteRmaRequest,
  DuplicateRmaRequestError,
  getRmaRequestById,
  listRmaRequests,
  peekNextRmaId,
  updateRmaRequest,
  rmaListDefaultPagination,
}
