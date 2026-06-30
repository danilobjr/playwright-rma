import { useState, type ComponentProps, type ReactNode } from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { beforeAll, expect, test, vi } from 'vitest'

import type { RmaRequest } from '../../../models/rma-request.model'
import {
  rmaListDefaultPagination,
  type RmaListPagination,
} from '../../../services/api/rma/rma-request.service'
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
  'RMA-2026-1001',
  'RMA-2026-1002',
  'RMA-2026-1003',
  'RMA-2026-1004',
  'RMA-2026-1005',
  'RMA-2026-1006',
  'RMA-2026-1007',
  'RMA-2026-1008',
  'RMA-2026-1009',
  'RMA-2026-1010',
]

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

function getRenderedRmaIds() {
  return within(screen.getByRole('table', { name: 'RMA Requests' }))
    .getAllByRole('link', { name: /^RMA-\d{4}-\d{4}$/ })
    .map((link) => link.textContent)
}

function getMobileRmaCard(rmaId: string) {
  return screen.getByRole('article', { name: `RMA Request ${rmaId}` })
}

function getPaginationRowCount() {
  const rowCount = screen.getByText('of', { selector: 'span' }).parentElement

  expect(rowCount).not.toBeNull()

  return rowCount as HTMLElement
}

function renderRmaListPage(
  props: Partial<ComponentProps<typeof RmaListPage>> = {},
) {
  const pageRequests = props.requests ?? requests
  const pagination: RmaListPagination = {
    ...rmaListDefaultPagination,
    totalRows: pageRequests.length,
    ...props.pagination,
  }

  return render(
    <RmaListPage
      requests={pageRequests}
      pagination={pagination}
      onDeleteRequest={vi.fn()}
      onFiltersFormSubmit={vi.fn()}
      onPaginationChange={vi.fn()}
      {...props}
    />,
  )
}

test('shows visible page RMA status summary counts', () => {
  renderRmaListPage({
    requests: requests.slice(0, 10),
    pagination: { ...rmaListDefaultPagination, totalRows: 12 },
  })

  expect(
    within(
      screen.getByRole('article', { name: 'Total RMAs summary' }),
    ).getByText('12'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Pending summary' })).getByText(
      '4',
    ),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Approved summary' })).getByText(
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
  renderRmaListPage()

  expect(
    screen
      .getAllByRole('article', { name: /summary$/ })
      .map((card) => card.getAttribute('aria-label')?.replace(' summary', '')),
  ).toEqual(['Total RMAs', 'Pending', 'Approved', 'Completed'])
})

test('does not use Dashboard terminology on the RMA List screen', () => {
  renderRmaListPage()

  expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument()
})

test('shows RMA Requests in the supplied page order', () => {
  renderRmaListPage({ requests: requests.slice(0, 10) })

  expect(getRenderedRmaIds()).toEqual(firstPageRmaIds)
})

test('shows RMA Requests table columns', () => {
  renderRmaListPage()

  expect(
    screen.getByRole('table', { name: 'RMA Requests' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'RMA ID' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Customer name' }),
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
    screen.getByRole('columnheader', { name: 'Submitted date' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('columnheader', { name: 'Actions' }),
  ).toBeInTheDocument()
})

test('links RMA row content and Status badge to the update screen', () => {
  renderRmaListPage()

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

test('shows mobile RMA Request cards with table-equivalent labels', () => {
  renderRmaListPage()

  const card = getMobileRmaCard('RMA-2026-1002')

  expect(within(card).getByText('RMA ID')).toBeInTheDocument()
  expect(
    within(card).getByRole('link', { name: 'RMA-2026-1002' }),
  ).toHaveAttribute('href', '/rma/RMA-2026-1002')
  expect(within(card).getByText('Customer name')).toBeInTheDocument()
  expect(within(card).getByText('Jordan Lee')).toBeInTheDocument()
  expect(within(card).getByText('Product ID')).toBeInTheDocument()
  expect(within(card).getByText('PRD-A1B2')).toBeInTheDocument()
  expect(within(card).getByText('Reason')).toBeInTheDocument()
  expect(
    within(card).getByText('Screen flickers after startup.'),
  ).toBeInTheDocument()
  expect(within(card).getByText('Status')).toBeInTheDocument()
  expect(within(card).getByText('Submitted date')).toBeInTheDocument()
  expect(within(card).getByText('Mar 4, 2026')).toBeInTheDocument()
  expect(within(card).getByText('Actions')).toBeInTheDocument()
})

test('links mobile RMA ID and Status badge to the update screen', () => {
  renderRmaListPage()

  const card = getMobileRmaCard('RMA-2026-1002')

  expect(
    within(card).getByRole('link', { name: 'RMA-2026-1002' }),
  ).toHaveAttribute('href', '/rma/RMA-2026-1002')
  expect(within(card).getByRole('link', { name: 'Pending' })).toHaveAttribute(
    'href',
    '/rma/RMA-2026-1002',
  )
})

test('shows delete confirmation copy and cancels without deleting', () => {
  const onDeleteRequest = vi.fn()

  renderRmaListPage({ onDeleteRequest })

  const row = screen.getByRole('row', { name: /RMA-2026-1002 Jordan Lee/ })

  fireEvent.click(within(row).getByRole('button', { name: 'Delete request' }))

  expect(
    screen.getByRole('heading', { name: 'Delete RMA Request?' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText(
      'This will remove RMA Request RMA-2026-1002 for Jordan Lee from the list. You cannot restore it after deleting.',
    ),
  ).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

  expect(onDeleteRequest).not.toHaveBeenCalled()
  expect(
    screen.queryByRole('heading', { name: 'Delete RMA Request?' }),
  ).not.toBeInTheDocument()
  expect(
    within(row).getByRole('link', { name: 'RMA-2026-1002' }),
  ).toBeInTheDocument()
})

test('deletes visible RMA Request and updates active counts', async () => {
  function StatefulRmaListPage() {
    const [activeRequests, setActiveRequests] = useState(requests)

    return (
      <RmaListPage
        requests={activeRequests}
        pagination={{
          ...rmaListDefaultPagination,
          totalRows: activeRequests.length,
        }}
        onDeleteRequest={(rmaId) => {
          setActiveRequests((currentRequests) =>
            currentRequests.filter((request) => request.rmaId !== rmaId),
          )
        }}
        onFiltersFormSubmit={vi.fn()}
        onPaginationChange={vi.fn()}
      />
    )
  }

  render(<StatefulRmaListPage />)

  const row = screen.getByRole('row', { name: /RMA-2026-1002 Jordan Lee/ })

  fireEvent.click(within(row).getByRole('button', { name: 'Delete request' }))
  fireEvent.click(screen.getByRole('button', { name: 'Delete request' }))

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', { name: 'Delete RMA Request?' }),
    ).not.toBeInTheDocument()
  })

  expect(
    within(
      screen.getByRole('article', { name: 'Total RMAs summary' }),
    ).getByText('11'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('article', { name: 'Pending summary' })).getByText(
      '4',
    ),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: 'RMA-2026-1002' }),
  ).not.toBeInTheDocument()
  expect(getPaginationRowCount()).toHaveTextContent('Showing 1-10 of 11')
})

test('exposes delete action for every Status', () => {
  renderRmaListPage({ onDeleteRequest: vi.fn() })

  for (const rmaId of [
    'RMA-2026-1002',
    'RMA-2026-1011',
    'RMA-2026-1008',
    'RMA-2026-1009',
  ]) {
    expect(
      within(screen.getByRole('row', { name: new RegExp(rmaId) })).getByRole(
        'button',
        { name: 'Delete request' },
      ),
    ).toBeInTheDocument()
  }
})

test('shows pagination range and emits pagination changes', () => {
  const onPaginationChange = vi.fn()
  renderRmaListPage({
    requests: requests.slice(0, 10),
    pagination: { ...rmaListDefaultPagination, totalRows: 12 },
    onPaginationChange,
  })

  expect(getRenderedRmaIds()).toHaveLength(10)
  expect(getPaginationRowCount()).toHaveTextContent('Showing 1-10 of 12')
  expect(
    screen.getAllByRole('link', { name: 'RMA-2026-1003' }).length,
  ).toBeGreaterThan(0)

  fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }))

  expect(onPaginationChange).toHaveBeenCalledWith({
    ...rmaListDefaultPagination,
    totalRows: 12,
    pageIndex: 1,
  })
})

test('applies Search only after Search is clicked', () => {
  const onFiltersFormSubmit = vi.fn()
  renderRmaListPage({ onFiltersFormSubmit })

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: '  screen   FLICKERS ' },
  })

  expect(screen.getAllByText('Sofia Rivera').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Jordan Lee').length).toBeGreaterThan(0)
  expect(onFiltersFormSubmit).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(onFiltersFormSubmit).toHaveBeenCalledWith({
    search: '  screen   FLICKERS ',
    status: '',
    submittedDate: undefined,
  })
})

test('submits Search text for server-side filtering', () => {
  const onFiltersFormSubmit = vi.fn()
  renderRmaListPage({ onFiltersFormSubmit })

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'prd-1a2b' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(onFiltersFormSubmit).toHaveBeenCalledWith({
    search: 'prd-1a2b',
    status: '',
    submittedDate: undefined,
  })
})

test('filters by Status from the Status field', () => {
  const onFiltersFormSubmit = vi.fn()
  renderRmaListPage({ onFiltersFormSubmit })

  fireEvent.click(screen.getByRole('combobox', { name: 'Status' }))
  expect(screen.queryByRole('option', { name: /All/ })).not.toBeInTheDocument()
  expect(screen.getByRole('option', { name: /Pending/ })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: /Approved/ })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: /Rejected/ })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: /Completed/ })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('option', { name: /Approved/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(onFiltersFormSubmit).toHaveBeenCalledWith({
    search: '',
    status: 'Approved',
    submittedDate: undefined,
  })
})

test('filters by exact Submitted date local calendar day', () => {
  const onFiltersFormSubmit = vi.fn()
  const submittedDate = new Date('2026-03-04T10:30:00.000Z')
  renderRmaListPage({
    filters: { search: '', status: '', submittedDate },
    onFiltersFormSubmit,
  })

  fireEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(onFiltersFormSubmit).toHaveBeenCalledWith({
    search: '',
    status: '',
    submittedDate,
  })
})

test('Reset submits default filters', () => {
  const onFiltersFormSubmit = vi.fn()
  renderRmaListPage({ onFiltersFormSubmit })

  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
    target: { value: 'Jordan' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

  expect(onFiltersFormSubmit).toHaveBeenCalledWith({
    search: '',
    status: '',
    submittedDate: undefined,
  })
})

test('emits first page when pagination first button is clicked', () => {
  const onPaginationChange = vi.fn()
  renderRmaListPage({
    requests: requests.slice(10),
    pagination: { ...rmaListDefaultPagination, pageIndex: 1, totalRows: 12 },
    onPaginationChange,
  })

  expect(getPaginationRowCount()).toHaveTextContent('Showing 11-12 of 12')
  fireEvent.click(screen.getByRole('button', { name: 'Go to first page' }))

  expect(onPaginationChange).toHaveBeenCalledWith({
    ...rmaListDefaultPagination,
    pageIndex: 0,
    totalRows: 12,
  })
})

test('shows supplied filter values in the form', () => {
  renderRmaListPage({
    filters: {
      search: 'Mina',
      status: 'Pending',
      submittedDate: new Date('2026-03-04T10:30:00.000Z'),
    },
  })

  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('Mina')
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
    'Pending',
  )
  expect(
    screen.getByRole('button', { name: 'Submitted date' }),
  ).toHaveTextContent('Mar 4, 2026')
})

test('shows error alert when loading fails', () => {
  renderRmaListPage({
    requests: [],
    isPending: false,
    isError: true,
    error: new Error('Failed to fetch'),
  })

  expect(screen.getByRole('alert')).toHaveTextContent(
    "Couldn't load RMA Requests",
  )
})

test('shows filtered-empty state with Reset when no results match filters', () => {
  renderRmaListPage({
    requests: [],
    pagination: { ...rmaListDefaultPagination, totalRows: 1 },
  })

  expect(screen.getByText('No RMA Requests found')).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /Reset filters/i }),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: /New RMA/ }),
  ).not.toBeInTheDocument()
})

test('shows empty state with New RMA action when no requests exist', () => {
  renderRmaListPage({ requests: [] })

  expect(screen.getByText('No RMA Requests')).toBeInTheDocument()
  expect(
    screen.getByText('Create an RMA Request to start tracking returns.'),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /New RMA/ })).toHaveAttribute(
    'href',
    '/rma/create',
  )
})

test('shows skeleton rows when loading and hides empty state', () => {
  renderRmaListPage({ requests: [], isPending: true })

  const skeletons = screen.getAllByTestId('rma-list-skeleton')
  expect(skeletons.length).toBeGreaterThan(0)
  expect(screen.queryByText('No RMA Requests')).not.toBeInTheDocument()
})

test('shows selected Status icon and label in the field', () => {
  renderRmaListPage()

  const statusField = screen.getByRole('combobox', { name: 'Status' })

  expect(statusField).toHaveTextContent('All')

  fireEvent.click(statusField)
  fireEvent.click(screen.getByRole('option', { name: /Approved/ }))

  expect(statusField).toHaveTextContent('Approved')
  expect(statusField).not.toHaveTextContent('Return is authorized')

  fireEvent.click(statusField)
  expect(
    screen.getByRole('option', { name: /Return is authorized/ }),
  ).toBeInTheDocument()
})
