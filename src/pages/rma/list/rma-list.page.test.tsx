import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'

import type { RmaRequest } from '@/services/api/rma/rma-request.model'

import { RmaListPage } from './rma-list.page'

const requests: RmaRequest[] = [
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
    status: 'Pending',
    customerName: 'Jordan Lee',
    productId: 'PRD-A1B2',
    reason: 'Screen flickers after startup.',
    createdAt: '2026-03-04T10:30:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1003',
    status: 'Approved',
    customerName: 'Mina Patel',
    productId: 'PRD-9C4D',
    reason: 'Battery does not hold charge longer than thirty minutes.',
    createdAt: '2026-02-08T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1004',
    status: 'Rejected',
    customerName: 'Noah Kim',
    productId: 'PRD-1A2B',
    reason: 'Return request is outside warranty period.',
    createdAt: '2026-02-09T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1005',
    status: 'Completed',
    customerName: 'Lena Ortiz',
    productId: 'PRD-3C4D',
    reason: 'Replacement was shipped after inspection.',
    createdAt: '2026-02-10T09:12:00.000Z',
  },
]

test('shows real RMA status summary counts', () => {
  render(<RmaListPage requests={requests} />)

  expect(
    within(
      screen.getByRole('article', { name: 'Total RMAs summary' }),
    ).getByText('5'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Pending summary' })).getByText(
      '2',
    ),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Approved summary' })).getByText(
      '1',
    ),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Rejected summary' })).getByText(
      '1',
    ),
  ).toBeInTheDocument()
  expect(
    within(
      screen.getByRole('article', { name: 'Completed summary' }),
    ).getByText('1'),
  ).toBeInTheDocument()
})

test('orders RMA status summary cards by workflow', () => {
  render(<RmaListPage requests={requests} />)

  expect(
    screen
      .getAllByRole('article', { name: /summary$/ })
      .map((card) => within(card).getByRole('heading').textContent),
  ).toEqual(['Total RMAs', 'Pending', 'Approved', 'Rejected', 'Completed'])
})

test('does not use Dashboard terminology on the RMA List screen', () => {
  render(<RmaListPage requests={requests} />)

  expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument()
})
