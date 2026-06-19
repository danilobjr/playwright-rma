import type {
  CreateRmaRequestInput,
  RmaRequest,
  RmaStatus,
} from './rma-request.model'

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

async function listRmaRequests() {
  return getAllRmaRequests()
}

async function peekNextRmaId() {
  return getNextRmaId(getAllRmaRequests())
}

async function createRmaRequest(input: CreateRmaRequestInput) {
  const existingRequests = readActiveRmaRequests()
  const createdAt = new Date()
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
    customerName: normalizeRequiredText(input.customerName, 'Customer Name'),
    productId: normalizeProductId(input.productId),
    reason: normalizeReason(input.reason),
    createdAt: createdAt.toISOString(),
  }

  writeActiveRmaRequests([...existingRequests, request])

  const currentYear = getCurrentYear()
  const requestSequence = Number(request.rmaId.split('-')[2])
  writeRmaIdSequence({ year: currentYear, nextSequence: requestSequence + 1 })

  return request
}

async function deleteRmaRequest(rmaId: string) {
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
}

export {
  createRmaRequest,
  deleteRmaRequest,
  DuplicateRmaRequestError,
  listRmaRequests,
  peekNextRmaId,
}
