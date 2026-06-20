import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createRmaRequest,
  deleteRmaRequest,
  getRmaRequestById,
  listRmaRequests,
  peekNextRmaId,
} from './rma-request.service'

const RMA_STORAGE_KEY = 'playwright-rma:rma-requests:v1'

async function waitForRmaApiResponse<T>(response: Promise<T>) {
  let result: T | undefined
  let rejection: unknown

  response.then(
    (value) => {
      result = value
    },
    (error: unknown) => {
      rejection = error
    },
  )

  await vi.advanceTimersByTimeAsync(1_000)

  if (rejection) {
    throw rejection
  }

  return result as T
}

describe('RMA request service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    vi.setSystemTime(new Date('2026-03-04T10:30:00.000Z'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('lists seeded RMA Requests when browser storage is empty', async () => {
    const requests = await waitForRmaApiResponse(listRmaRequests())

    expect(requests).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rmaId: 'RMA-2026-1001',
          status: 'Pending',
          customerName: 'Avery Stone',
          productId: 'PRD-7F2A',
        }),
      ]),
    )
  })

  it('reads a seeded RMA Request by exact RMA ID', async () => {
    await expect(
      waitForRmaApiResponse(getRmaRequestById('RMA-2026-1002')),
    ).resolves.toMatchObject({
      rmaId: 'RMA-2026-1002',
      status: 'Approved',
      customerName: 'Mina Patel',
      productId: 'PRD-9C4D',
      reason: 'Battery does not hold charge longer than thirty minutes.',
      createdAt: '2026-02-08T09:12:00.000Z',
    })
  })

  it('returns undefined for missing RMA ID reads', async () => {
    await expect(
      waitForRmaApiResponse(getRmaRequestById('RMA-2026-9999')),
    ).resolves.toBeUndefined()
  })

  it('uses case-sensitive exact RMA ID reads', async () => {
    await expect(
      waitForRmaApiResponse(getRmaRequestById('rma-2026-1002')),
    ).resolves.toBeUndefined()
  })

  it('keeps RMA ID reads pending before the simulated delay completes', async () => {
    const response = getRmaRequestById('RMA-2026-1002')
    let settled = false

    response.then(() => {
      settled = true
    })

    await vi.advanceTimersByTimeAsync(999)
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await response

    expect(settled).toBe(true)
  })

  it('keeps exported responses pending before the simulated delay completes', async () => {
    const response = listRmaRequests()
    let settled = false

    response.then(() => {
      settled = true
    })

    await vi.advanceTimersByTimeAsync(999)
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await response

    expect(settled).toBe(true)
  })

  it('creates a Pending RMA Request with the next current-year RMA ID', async () => {
    const request = await waitForRmaApiResponse(
      createRmaRequest({
        customerName: ' Jordan  Lee ',
        productId: 'prd-a1b2',
        reason: '  Screen flickers after startup.  ',
      }),
    )

    expect(request).toEqual({
      rmaId: 'RMA-2026-1003',
      status: 'Pending',
      customerName: 'Jordan Lee',
      productId: 'PRD-A1B2',
      reason: 'Screen flickers after startup.',
      createdAt: '2026-03-04T10:30:00.000Z',
    })

    await expect(waitForRmaApiResponse(listRmaRequests())).resolves.toEqual(
      expect.arrayContaining([request]),
    )
  })

  it('creates no request before the simulated delay completes', async () => {
    const response = createRmaRequest({
      customerName: 'Jordan Lee',
      productId: 'PRD-A1B2',
      reason: 'Screen flickers after startup.',
    })

    await vi.advanceTimersByTimeAsync(999)
    expect(localStorage.getItem(RMA_STORAGE_KEY)).toBeNull()

    const request = await waitForRmaApiResponse(response)

    await expect(waitForRmaApiResponse(listRmaRequests())).resolves.toEqual(
      expect.arrayContaining([request]),
    )
  })

  it('previews the next RMA ID without creating a request', async () => {
    await expect(waitForRmaApiResponse(peekNextRmaId())).resolves.toBe(
      'RMA-2026-1003',
    )
  })

  it('hard-deletes a seeded RMA Request from the active list', async () => {
    await expect(
      waitForRmaApiResponse(deleteRmaRequest('RMA-2026-1001')),
    ).resolves.toMatchObject({
      rmaId: 'RMA-2026-1001',
      customerName: 'Avery Stone',
    })

    await expect(waitForRmaApiResponse(listRmaRequests())).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rmaId: 'RMA-2026-1001' }),
      ]),
    )
  })

  it('keeps deleted RMA Requests visible before the simulated delay completes', async () => {
    const response = deleteRmaRequest('RMA-2026-1001')

    await vi.advanceTimersByTimeAsync(999)
    expect(localStorage.getItem(RMA_STORAGE_KEY)).toBeNull()

    await waitForRmaApiResponse(response)

    await expect(waitForRmaApiResponse(listRmaRequests())).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rmaId: 'RMA-2026-1001' }),
      ]),
    )
  })

  it('keeps deleted seeded RMA Requests hidden after new requests are added', async () => {
    await waitForRmaApiResponse(deleteRmaRequest('RMA-2026-1001'))
    await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Jordan Lee',
        productId: 'PRD-A1B2',
        reason: 'Screen flickers after startup.',
      }),
    )

    await expect(waitForRmaApiResponse(listRmaRequests())).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rmaId: 'RMA-2026-1001' }),
      ]),
    )
  })

  it('hard-deletes a created RMA Request from the active list', async () => {
    const request = await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Jordan Lee',
        productId: 'PRD-A1B2',
        reason: 'Screen flickers after startup.',
      }),
    )

    await waitForRmaApiResponse(deleteRmaRequest(request.rmaId))

    await expect(waitForRmaApiResponse(listRmaRequests())).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rmaId: request.rmaId }),
      ]),
    )
  })

  it('rejects missing required values', async () => {
    await expect(
      waitForRmaApiResponse(
        createRmaRequest({
          customerName: '',
          productId: 'PRD-A1B2',
          reason: '',
        }),
      ),
    ).rejects.toThrow('Customer name is required')
  })

  it('keeps failures pending before the simulated delay completes', async () => {
    const response = createRmaRequest({
      customerName: '',
      productId: 'PRD-A1B2',
      reason: '',
    })
    let settled = false

    response.catch(() => {
      settled = true
    })

    await vi.advanceTimersByTimeAsync(999)
    expect(settled).toBe(false)

    await expect(waitForRmaApiResponse(response)).rejects.toThrow(
      'Customer name is required',
    )
  })

  it('rejects reasons outside the allowed length bounds', async () => {
    await expect(
      waitForRmaApiResponse(
        createRmaRequest({
          customerName: 'Jordan Lee',
          productId: 'PRD-A1B2',
          reason: 'Too short',
        }),
      ),
    ).rejects.toThrow('Reason must be at least 10 characters')

    await expect(
      waitForRmaApiResponse(
        createRmaRequest({
          customerName: 'Jordan Lee',
          productId: 'PRD-A1B2',
          reason: 'a'.repeat(256),
        }),
      ),
    ).rejects.toThrow('Reason must be at most 255 characters')
  })

  it('blocks a matching Pending RMA Request regardless of date', async () => {
    vi.setSystemTime(new Date('2027-06-01T10:30:00.000Z'))

    await expect(
      waitForRmaApiResponse(
        createRmaRequest({
          customerName: 'avery stone',
          productId: 'prd-7f2a',
          reason: 'display panel intermittently turns black during use.',
        }),
      ),
    ).rejects.toMatchObject({
      matchingRmaId: 'RMA-2026-1001',
      matchingStatus: 'Pending',
    })
  })

  it('normalizes text before duplicate comparison without changing stored text', async () => {
    await expect(
      waitForRmaApiResponse(
        createRmaRequest({
          customerName: '  AVERY   STONE  ',
          productId: 'prd-7f2a',
          reason: 'Display   panel intermittently turns BLACK during use.',
        }),
      ),
    ).rejects.toMatchObject({
      matchingRmaId: 'RMA-2026-1001',
      matchingStatus: 'Pending',
    })

    await expect(waitForRmaApiResponse(listRmaRequests())).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rmaId: 'RMA-2026-1001',
          customerName: 'Avery Stone',
          reason: 'Display panel intermittently turns black during use.',
        }),
      ]),
    )
  })

  it('blocks matching non-Pending RMA Requests only on the same local calendar day', async () => {
    vi.setSystemTime(new Date('2026-02-08T20:30:00.000Z'))

    await expect(
      waitForRmaApiResponse(
        createRmaRequest({
          customerName: 'Mina Patel',
          productId: 'PRD-9C4D',
          reason: 'Battery does not hold charge longer than thirty minutes.',
        }),
      ),
    ).rejects.toMatchObject({
      matchingRmaId: 'RMA-2026-1002',
      matchingStatus: 'Approved',
    })

    vi.setSystemTime(new Date('2026-02-09T10:30:00.000Z'))

    await expect(
      waitForRmaApiResponse(
        createRmaRequest({
          customerName: 'Mina Patel',
          productId: 'PRD-9C4D',
          reason: 'Battery does not hold charge longer than thirty minutes.',
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Pending',
      customerName: 'Mina Patel',
      productId: 'PRD-9C4D',
    })
  })

  it('does not reuse RMA ID after hard-deleting the highest active request', async () => {
    const first = await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Jordan Lee',
        productId: 'PRD-A1B2',
        reason: 'Screen flickers after startup.',
      }),
    )

    expect(first.rmaId).toBe('RMA-2026-1003')

    await waitForRmaApiResponse(deleteRmaRequest(first.rmaId))

    const second = await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Taylor Reed',
        productId: 'PRD-C3D4',
        reason: 'Device overheats during normal use.',
      }),
    )

    expect(second.rmaId).toBe('RMA-2026-1004')
  })

  it('previews monotonic next RMA ID after delete of highest request', async () => {
    const first = await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Jordan Lee',
        productId: 'PRD-A1B2',
        reason: 'Screen flickers after startup.',
      }),
    )

    expect(first.rmaId).toBe('RMA-2026-1003')

    await expect(waitForRmaApiResponse(peekNextRmaId())).resolves.toBe(
      'RMA-2026-1004',
    )

    await waitForRmaApiResponse(deleteRmaRequest(first.rmaId))

    await expect(waitForRmaApiResponse(peekNextRmaId())).resolves.toBe(
      'RMA-2026-1004',
    )
  })

  it('preserves sequence counter when all active requests are deleted', async () => {
    const first = await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Jordan Lee',
        productId: 'PRD-A1B2',
        reason: 'Screen flickers after startup.',
      }),
    )

    await waitForRmaApiResponse(deleteRmaRequest(first.rmaId))
    await waitForRmaApiResponse(deleteRmaRequest('RMA-2026-1001'))
    await waitForRmaApiResponse(deleteRmaRequest('RMA-2026-1002'))

    const second = await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Taylor Reed',
        productId: 'PRD-C3D4',
        reason: 'Device overheats during normal use.',
      }),
    )

    expect(second.rmaId).toBe('RMA-2026-1004')
  })

  it('resets RMA ID sequence to start value for a new year', async () => {
    await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Jordan Lee',
        productId: 'PRD-A1B2',
        reason: 'Screen flickers after startup.',
      }),
    )

    vi.setSystemTime(new Date('2027-01-15T10:30:00.000Z'))

    const request = await waitForRmaApiResponse(
      createRmaRequest({
        customerName: 'Taylor Reed',
        productId: 'PRD-C3D4',
        reason: 'Device overheats during normal use.',
      }),
    )

    expect(request.rmaId).toBe('RMA-2027-1001')
  })
})
