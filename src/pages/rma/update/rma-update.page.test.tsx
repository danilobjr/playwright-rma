import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'

import type { RmaRequest } from '@/services/api/rma/rma-request.model'

import { RmaUpdatePage } from './rma-update.page'

const request: RmaRequest = {
  rmaId: 'RMA-2026-1002',
  status: 'Approved',
  customerName: 'Mina Patel',
  productId: 'PRD-9C4D',
  reason: 'Battery does not hold charge longer than thirty minutes.',
  createdAt: '2026-02-08T09:12:00.000Z',
}

test('shows loaded RMA Request details as read-only content', () => {
  render(<RmaUpdatePage request={request} />)

  const card = screen.getByRole('article', {
    name: 'RMA Request RMA-2026-1002',
  })

  expect(
    within(card).getByRole('heading', { name: 'RMA-2026-1002' }),
  ).toBeInTheDocument()
  expect(within(card).getByText('Submitted Feb 8, 2026')).toBeInTheDocument()
  expect(within(card).getByText('RMA ID')).toBeInTheDocument()
  expect(within(card).getByText('Customer name')).toBeInTheDocument()
  expect(within(card).getByText('Mina Patel')).toBeInTheDocument()
  expect(within(card).getByText('Product ID')).toBeInTheDocument()
  expect(within(card).getByText('PRD-9C4D')).toBeInTheDocument()
  expect(within(card).getByText('Reason')).toBeInTheDocument()
  expect(
    within(card).getByText(
      'Battery does not hold charge longer than thirty minutes.',
    ),
  ).toBeInTheDocument()
  expect(within(card).getByText('Submitted date')).toBeInTheDocument()
  expect(within(card).getByText('Feb 8, 2026')).toBeInTheDocument()
  expect(within(card).queryByRole('textbox')).not.toBeInTheDocument()
})

test('shows loading skeleton in stable card layout', () => {
  render(<RmaUpdatePage isPending={true} />)

  expect(
    screen.getByRole('article', { name: 'Loading RMA Request' }),
  ).toBeInTheDocument()
  expect(screen.getAllByTestId('rma-update-skeleton').length).toBeGreaterThan(0)
})

test('starts Status select with saved Status and keeps options closed by default', () => {
  render(<RmaUpdatePage request={request} />)

  const statusField = screen.getByRole('combobox', { name: 'Status' })

  expect(statusField).toHaveTextContent('Approved')
  expect(
    screen.queryByRole('option', { name: /Pending/ }),
  ).not.toBeInTheDocument()

  fireEvent.click(statusField)

  expect(screen.getByRole('option', { name: /Pending/ })).toBeInTheDocument()
  expect(
    screen.getByRole('option', { name: /Return is authorized/ }),
  ).toBeInTheDocument()
})
