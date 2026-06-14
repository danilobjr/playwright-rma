import type { CreateRmaRequestInput, RmaRequest } from './rma-request.model'

const RMA_STORAGE_KEY = 'playwright-rma:rma-requests:v1'
const RMA_ID_START_SEQUENCE = 1001
const PENDING_STATUS = 'Pending'

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

function readStoredRmaRequests() {
  const stored = localStorage.getItem(RMA_STORAGE_KEY)

  if (!stored) {
    return []
  }

  return JSON.parse(stored) as RmaRequest[]
}

function writeStoredRmaRequests(requests: RmaRequest[]) {
  localStorage.setItem(RMA_STORAGE_KEY, JSON.stringify(requests))
}

function getAllRmaRequests() {
  return [...seedRmaRequests, ...readStoredRmaRequests()]
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
  const nextSequence = Math.max(RMA_ID_START_SEQUENCE - 1, ...currentYearSequences) + 1

  return `RMA-${currentYear}-${nextSequence}`
}

async function listRmaRequests() {
  return getAllRmaRequests()
}

async function peekNextRmaId() {
  return getNextRmaId(getAllRmaRequests())
}

async function createRmaRequest(input: CreateRmaRequestInput) {
  const storedRequests = readStoredRmaRequests()
  const request: RmaRequest = {
    rmaId: getNextRmaId([...seedRmaRequests, ...storedRequests]),
    status: PENDING_STATUS,
    customerName: normalizeRequiredText(input.customerName, 'Customer Name'),
    productId: normalizeProductId(input.productId),
    reason: normalizeRequiredText(input.reason, 'Reason'),
    createdAt: new Date().toISOString(),
  }

  writeStoredRmaRequests([...storedRequests, request])

  return request
}

export { createRmaRequest, listRmaRequests, peekNextRmaId }
