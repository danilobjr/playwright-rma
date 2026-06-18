import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeAll, expect, test, vi } from 'vitest'

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

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

function getRenderedRmaIds() {
  return screen
    .getAllByRole('article', { name: /^RMA-\d{4}-\d{4}/ })
    .map((card) => within(card).getByRole('heading').textContent)
}

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

test('sorts RMA Requests by Submitted Date descending by default', () => {
  render(<RmaListPage requests={requests} />)

  expect(getRenderedRmaIds()).toEqual([
    'RMA-2026-1002',
    'RMA-2026-1005',
    'RMA-2026-1004',
    'RMA-2026-1003',
    'RMA-2026-1001',
  ])
})

test('applies Search only after Search is clicked', () => {
  render(<RmaListPage requests={requests} />)

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: '  screen   FLICKERS ' },
  })

  expect(screen.getByText('Avery Stone')).toBeInTheDocument()
  expect(screen.getByText('Jordan Lee')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(screen.queryByText('Avery Stone')).not.toBeInTheDocument()
  expect(screen.getByText('Jordan Lee')).toBeInTheDocument()
})

test('searches RMA ID, Customer Name, Product ID, and Reason', () => {
  render(<RmaListPage requests={requests} />)

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'prd-1a2b' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1004'])

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'lena ortiz' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1005'])

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'RMA-2026-1003' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1003'])

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'outside warranty' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1004'])
})

test('filters by Status from the Status field', () => {
  render(<RmaListPage requests={requests} />)

  fireEvent.click(screen.getByRole('combobox', { name: 'Status' }))
  expect(screen.queryByRole('option', { name: /All/ })).not.toBeInTheDocument()
  expect(screen.getByRole('option', { name: /Pending/ })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: /Approved/ })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: /Rejected/ })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: /Completed/ })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('option', { name: /Approved/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1003'])
})

test('filters by exact Submitted Date local calendar day', () => {
  render(<RmaListPage requests={requests} />)

  fireEvent.click(screen.getByRole('button', { name: 'Submitted Date' }))
  fireEvent.click(
    screen.getByRole('button', { name: 'Wednesday, March 4th, 2026' }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1002'])
})

test('Reset clears draft filters, applied filters, and selected summary card', () => {
  render(<RmaListPage requests={requests} />)

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'Jordan' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1002'])

  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
    'Status',
  )
  expect(getRenderedRmaIds()).toEqual([
    'RMA-2026-1002',
    'RMA-2026-1005',
    'RMA-2026-1004',
    'RMA-2026-1003',
    'RMA-2026-1001',
  ])
})

test('summary cards clear filters, submit, and sync the Status field', () => {
  render(<RmaListPage requests={requests} />)

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'Mina' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Submitted Date' }))
  fireEvent.click(
    screen.getByRole('button', { name: 'Wednesday, March 4th, 2026' }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Pending summary' }))

  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
    'Pending',
  )
  expect(
    screen.getByRole('button', { name: 'Submitted Date' }),
  ).toHaveTextContent('Submitted Date')
  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1002', 'RMA-2026-1001'])

  fireEvent.click(screen.getByRole('button', { name: 'Total RMAs summary' }))

  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
    'Status',
  )
  expect(
    screen.getByRole('button', { name: 'Submitted Date' }),
  ).toHaveTextContent('Submitted Date')
  expect(getRenderedRmaIds()).toEqual([
    'RMA-2026-1002',
    'RMA-2026-1005',
    'RMA-2026-1004',
    'RMA-2026-1003',
    'RMA-2026-1001',
  ])
})

test('shows selected Status icon and label in the field', () => {
  render(<RmaListPage requests={requests} />)

  const statusField = screen.getByRole('combobox', { name: 'Status' })

  expect(statusField).toHaveTextContent('Status')

  fireEvent.click(statusField)
  fireEvent.click(screen.getByRole('option', { name: /Approved/ }))

  expect(statusField).toHaveTextContent('Approved')
  expect(statusField).not.toHaveTextContent('Authorized for return')

  fireEvent.click(statusField)
  expect(
    screen.getByRole('option', { name: /Authorized for return/ }),
  ).toBeInTheDocument()
})
