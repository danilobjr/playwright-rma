import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createRmaRequest, listRmaRequests, peekNextRmaId } from './rma-request.service'

describe('RMA request service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-04T10:30:00.000Z'))
  })

  it('lists seeded RMA Requests when browser storage is empty', async () => {
    const requests = await listRmaRequests()

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

  it('creates a Pending RMA Request with the next current-year RMA ID', async () => {
    const request = await createRmaRequest({
      customerName: ' Jordan  Lee ',
      productId: 'prd-a1b2',
      reason: '  Screen flickers after startup.  ',
    })

    expect(request).toEqual({
      rmaId: 'RMA-2026-1003',
      status: 'Pending',
      customerName: 'Jordan Lee',
      productId: 'PRD-A1B2',
      reason: 'Screen flickers after startup.',
      createdAt: '2026-03-04T10:30:00.000Z',
    })

    await expect(listRmaRequests()).resolves.toEqual(expect.arrayContaining([request]))
  })

  it('previews the next RMA ID without creating a request', async () => {
    await expect(peekNextRmaId()).resolves.toBe('RMA-2026-1003')
  })

  it('rejects missing required values', async () => {
    await expect(
      createRmaRequest({ customerName: '', productId: 'PRD-A1B2', reason: '' }),
    ).rejects.toThrow('Customer Name is required')
  })
})
