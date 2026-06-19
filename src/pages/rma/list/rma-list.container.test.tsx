import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'

import type { RmaRequest } from '@/services/api/rma/rma-request.model'

import { RmaListContainer } from './rma-list.container'

const seedRequests: RmaRequest[] = [
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
    customerName: 'Jordan Lee',
    productId: 'PRD-A1B2',
    reason: 'Screen flickers after startup.',
    createdAt: '2026-03-04T10:30:00.000Z',
  },
]

const { listRmaRequests, peekNextRmaId, toastSuccess, deleteRmaRequest } =
  vi.hoisted(() => ({
    listRmaRequests: vi.fn(),
    peekNextRmaId: vi.fn(),
    toastSuccess: vi.fn(),
    deleteRmaRequest: vi.fn(),
  }))

vi.mock('@/services/api/rma/rma-request.service', () => ({
  deleteRmaRequest,
  listRmaRequests,
  peekNextRmaId,
}))

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccess,
  },
}))

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

function renderWithQueryClient(children: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  )
}

beforeEach(() => {
  listRmaRequests.mockReturnValue(seedRequests)
  peekNextRmaId.mockReturnValue('RMA-2026-1003')
  toastSuccess.mockClear()
})

test('deletes an RMA Request, refreshes the list, and shows success toast', async () => {
  renderWithQueryClient(<RmaListContainer />)

  const row = await screen.findByRole('row', {
    name: /RMA-2026-1001 Avery Stone/,
  })

  fireEvent.click(within(row).getByRole('button', { name: 'Delete request' }))
  fireEvent.click(screen.getByRole('button', { name: 'Delete request' }))

  await waitFor(() => {
    expect(toastSuccess).toHaveBeenCalledWith('RMA Request deleted')
  })
})

test('shows error alert when RMA requests fail to load', async () => {
  listRmaRequests.mockRejectedValue(new Error('Network error'))

  renderWithQueryClient(<RmaListContainer />)

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      "Couldn't load RMA Requests",
    )
  })
})
