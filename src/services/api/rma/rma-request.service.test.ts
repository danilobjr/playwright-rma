import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createRmaRequest,
  deleteRmaRequest,
  listRmaRequests,
  peekNextRmaId,
} from './rma-request.service'

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

    await expect(listRmaRequests()).resolves.toEqual(
      expect.arrayContaining([request]),
    )
  })

  it('previews the next RMA ID without creating a request', async () => {
    await expect(peekNextRmaId()).resolves.toBe('RMA-2026-1003')
  })

  it('hard-deletes a seeded RMA Request from the active list', async () => {
    await expect(deleteRmaRequest('RMA-2026-1001')).resolves.toMatchObject({
      rmaId: 'RMA-2026-1001',
      customerName: 'Avery Stone',
    })

    await expect(listRmaRequests()).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rmaId: 'RMA-2026-1001' }),
      ]),
    )
  })

  it('keeps deleted seeded RMA Requests hidden after new requests are added', async () => {
    await deleteRmaRequest('RMA-2026-1001')
    await createRmaRequest({
      customerName: 'Jordan Lee',
      productId: 'PRD-A1B2',
      reason: 'Screen flickers after startup.',
    })

    await expect(listRmaRequests()).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rmaId: 'RMA-2026-1001' }),
      ]),
    )
  })

  it('hard-deletes a created RMA Request from the active list', async () => {
    const request = await createRmaRequest({
      customerName: 'Jordan Lee',
      productId: 'PRD-A1B2',
      reason: 'Screen flickers after startup.',
    })

    await deleteRmaRequest(request.rmaId)

    await expect(listRmaRequests()).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rmaId: request.rmaId }),
      ]),
    )
  })

  it('rejects missing required values', async () => {
    await expect(
      createRmaRequest({ customerName: '', productId: 'PRD-A1B2', reason: '' }),
    ).rejects.toThrow('Customer Name is required')
  })

  it('rejects reasons outside the allowed length bounds', async () => {
    await expect(
      createRmaRequest({
        customerName: 'Jordan Lee',
        productId: 'PRD-A1B2',
        reason: 'Too short',
      }),
    ).rejects.toThrow('Reason must be at least 10 characters')

    await expect(
      createRmaRequest({
        customerName: 'Jordan Lee',
        productId: 'PRD-A1B2',
        reason: 'a'.repeat(256),
      }),
    ).rejects.toThrow('Reason must be at most 255 characters')
  })

  it('blocks a matching Pending RMA Request regardless of date', async () => {
    vi.setSystemTime(new Date('2027-06-01T10:30:00.000Z'))

    await expect(
      createRmaRequest({
        customerName: 'avery stone',
        productId: 'prd-7f2a',
        reason: 'display panel intermittently turns black during use.',
      }),
    ).rejects.toMatchObject({
      matchingRmaId: 'RMA-2026-1001',
      matchingStatus: 'Pending',
    })
  })

  it('normalizes text before duplicate comparison without changing stored text', async () => {
    await expect(
      createRmaRequest({
        customerName: '  AVERY   STONE  ',
        productId: 'prd-7f2a',
        reason: 'Display   panel intermittently turns BLACK during use.',
      }),
    ).rejects.toMatchObject({
      matchingRmaId: 'RMA-2026-1001',
      matchingStatus: 'Pending',
    })

    await expect(listRmaRequests()).resolves.toEqual(
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
      createRmaRequest({
        customerName: 'Mina Patel',
        productId: 'PRD-9C4D',
        reason: 'Battery does not hold charge longer than thirty minutes.',
      }),
    ).rejects.toMatchObject({
      matchingRmaId: 'RMA-2026-1002',
      matchingStatus: 'Approved',
    })

    vi.setSystemTime(new Date('2026-02-09T10:30:00.000Z'))

    await expect(
      createRmaRequest({
        customerName: 'Mina Patel',
        productId: 'PRD-9C4D',
        reason: 'Battery does not hold charge longer than thirty minutes.',
      }),
    ).resolves.toMatchObject({
      status: 'Pending',
      customerName: 'Mina Patel',
      productId: 'PRD-9C4D',
    })
  })
})
