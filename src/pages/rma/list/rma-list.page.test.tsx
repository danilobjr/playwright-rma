import { type ReactNode } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeAll, expect, test, vi } from 'vitest'

import type { RmaRequest } from '@/services/api/rma/rma-request.model'

import { RmaListPage } from './rma-list.page'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    params,
    to,
    ...otherProps
  }: {
    children: ReactNode
    params?: { rmaId: string }
    to: string
  }) => (
    <a href={to.replace('$rmaId', params?.rmaId ?? '')} {...otherProps}>
      {children}
    </a>
  ),
}))

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
  {
    rmaId: 'RMA-2026-1006',
    status: 'Pending',
    customerName: 'Owen Brooks',
    productId: 'PRD-4E5F',
    reason: 'Charging port disconnects when cable moves slightly.',
    createdAt: '2026-02-11T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1007',
    status: 'Approved',
    customerName: 'Priya Singh',
    productId: 'PRD-6G7H',
    reason: 'Device overheats after fifteen minutes of usage.',
    createdAt: '2026-02-12T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1008',
    status: 'Rejected',
    customerName: 'Ethan Wright',
    productId: 'PRD-8I9J',
    reason: 'Cosmetic scratch does not affect normal operation.',
    createdAt: '2026-02-13T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1009',
    status: 'Completed',
    customerName: 'Sofia Rivera',
    productId: 'PRD-0K1L',
    reason: 'Replacement completed after inspection confirmed defect.',
    createdAt: '2026-02-14T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1010',
    status: 'Pending',
    customerName: 'Mateo Garcia',
    productId: 'PRD-2M3N',
    reason: 'Keyboard input repeats several letters unexpectedly.',
    createdAt: '2026-02-15T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1011',
    status: 'Approved',
    customerName: 'Iris Chen',
    productId: 'PRD-4O5P',
    reason: 'Network adapter drops connection under normal use.',
    createdAt: '2026-02-16T09:12:00.000Z',
  },
  {
    rmaId: 'RMA-2026-1012',
    status: 'Pending',
    customerName: 'Kai Morgan',
    productId: 'PRD-6Q7R',
    reason: 'Audio output crackles during video playback.',
    createdAt: '2026-02-17T09:12:00.000Z',
  },
]

const firstPageRmaIds = [
  'RMA-2026-1002',
  'RMA-2026-1012',
  'RMA-2026-1011',
  'RMA-2026-1010',
  'RMA-2026-1009',
  'RMA-2026-1008',
  'RMA-2026-1007',
  'RMA-2026-1006',
  'RMA-2026-1005',
  'RMA-2026-1004',
]

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

function getRenderedRmaIds() {
  return screen
    .getAllByRole('link', { name: /^RMA-\d{4}-\d{4}$/ })
    .map((link) => link.textContent)
}

test('shows real RMA status summary counts', () => {
  render(<RmaListPage requests={requests} />)

  expect(
    within(
      screen.getByRole('article', { name: 'Total RMAs summary' }),
    ).getByText('12'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Pending summary' })).getByText(
      '5',
    ),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Approved summary' })).getByText(
      '3',
    ),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Rejected summary' })).getByText(
      '2',
    ),
  ).toBeInTheDocument()
  expect(
    within(
      screen.getByRole('article', { name: 'Completed summary' }),
    ).getByText('2'),
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

  expect(getRenderedRmaIds()).toEqual(firstPageRmaIds)
})

test('shows RMA Requests table columns', () => {
  render(<RmaListPage requests={requests} />)

  expect(
    screen.getByRole('table', { name: 'RMA Requests' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'RMA ID' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Customer Name' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Product ID' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Reason' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Status' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Submitted Date' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Actions' }),
  ).toBeInTheDocument()
})

test('links RMA row content and Status badge to the update screen', () => {
  render(<RmaListPage requests={requests} />)

  const row = screen.getByRole('row', { name: /RMA-2026-1002 Jordan Lee/ })

  expect(
    within(row).getByRole('link', { name: 'RMA-2026-1002' }),
  ).toHaveAttribute('href', '/rma/RMA-2026-1002')
  expect(within(row).getByRole('link', { name: 'Jordan Lee' })).toHaveAttribute(
    'href',
    '/rma/RMA-2026-1002',
  )
  expect(within(row).getByRole('link', { name: 'PRD-A1B2' })).toHaveAttribute(
    'href',
    '/rma/RMA-2026-1002',
  )
  expect(
    within(row).getByRole('link', { name: 'Screen flickers after startup.' }),
  ).toHaveAttribute('href', '/rma/RMA-2026-1002')
  expect(within(row).getByRole('link', { name: 'Pending' })).toHaveAttribute(
    'href',
    '/rma/RMA-2026-1002',
  )
})

test('paginates RMA Requests with visible range and total count', () => {
  render(<RmaListPage requests={requests} />)

  expect(getRenderedRmaIds()).toHaveLength(10)
  expect(screen.getByText('Showing 1-10 of 12')).toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: 'RMA-2026-1003' }),
  ).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }))

  expect(getRenderedRmaIds()).toEqual(['RMA-2026-1003', 'RMA-2026-1001'])
  expect(screen.getByText('Showing 11-12 of 12')).toBeInTheDocument()
})

test('applies Search only after Search is clicked', () => {
  render(<RmaListPage requests={requests} />)

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: '  screen   FLICKERS ' },
  })

  expect(screen.getByText('Sofia Rivera')).toBeInTheDocument()
  expect(screen.getByText('Jordan Lee')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(screen.queryByText('Sofia Rivera')).not.toBeInTheDocument()
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

  expect(getRenderedRmaIds()).toEqual([
    'RMA-2026-1011',
    'RMA-2026-1007',
    'RMA-2026-1003',
  ])
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
  expect(getRenderedRmaIds()).toEqual(firstPageRmaIds)
})

test('resets pagination when filters or summary cards change', () => {
  render(<RmaListPage requests={requests} />)

  fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }))
  expect(screen.getByText('Showing 11-12 of 12')).toBeInTheDocument()

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'Jordan' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
  expect(screen.getByText('Showing 1-1 of 1')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
  fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }))
  fireEvent.click(screen.getByRole('button', { name: 'Pending summary' }))
  expect(screen.getByText('Showing 1-5 of 5')).toBeInTheDocument()
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
  expect(getRenderedRmaIds()).toEqual([
    'RMA-2026-1002',
    'RMA-2026-1012',
    'RMA-2026-1010',
    'RMA-2026-1006',
    'RMA-2026-1001',
  ])

  fireEvent.click(screen.getByRole('button', { name: 'Total RMAs summary' }))

  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
    'Status',
  )
  expect(
    screen.getByRole('button', { name: 'Submitted Date' }),
  ).toHaveTextContent('Submitted Date')
  expect(getRenderedRmaIds()).toEqual(firstPageRmaIds)
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
