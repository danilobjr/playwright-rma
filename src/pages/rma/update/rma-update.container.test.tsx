import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'

import type { RmaRequest } from '@/services/api/rma/rma-request.model'

import { RmaUpdateContainer } from './rma-update.container'

const request: RmaRequest = {
  rmaId: 'RMA-2026-1002',
  status: 'Approved',
  customerName: 'Mina Patel',
  productId: 'PRD-9C4D',
  reason: 'Battery does not hold charge longer than thirty minutes.',
  createdAt: '2026-02-08T09:12:00.000Z',
}

const {
  getRmaRequestById,
  listRmaRequests,
  peekNextRmaId,
  updateRmaRequest,
  toastSuccess,
  navigate,
} = vi.hoisted(() => ({
  getRmaRequestById: vi.fn(),
  listRmaRequests: vi.fn(),
  peekNextRmaId: vi.fn(),
  updateRmaRequest: vi.fn(),
  toastSuccess: vi.fn(),
  navigate: vi.fn<(args: { to: string }) => void>(),
}))

vi.mock('@/services/api/rma/rma-request.service', () => ({
  getRmaRequestById,
  listRmaRequests,
  peekNextRmaId,
  updateRmaRequest,
}))

vi.mock('@/components/app/toast.util', () => ({
  successToast: toastSuccess,
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...otherProps
  }: {
    children: ReactNode
    to: string
  }) => (
    <a href={to} {...otherProps}>
      {children}
    </a>
  ),
  useNavigate: () => navigate,
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
  getRmaRequestById.mockResolvedValue(request)
  listRmaRequests.mockResolvedValue([])
  peekNextRmaId.mockResolvedValue('RMA-2026-1003')
})

test('loads the RMA Request by route RMA ID', async () => {
  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-2026-1002" />)

  await waitFor(() => {
    expect(getRmaRequestById).toHaveBeenCalledWith('RMA-2026-1002')
  })

  expect(await screen.findByText('Mina Patel')).toBeInTheDocument()
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
    'Approved',
  )
})

test('shows not-found state when RMA ID returns no data', async () => {
  getRmaRequestById.mockResolvedValue(undefined)

  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-9999" />)

  expect(
    await screen.findByRole('heading', { name: 'RMA request not found' }),
  ).toBeInTheDocument()
})

test('shows error state on load failure and retries via Try again', async () => {
  getRmaRequestById.mockRejectedValue(new Error('Network failure'))

  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-9999" />)

  await screen.findByText('Unable to load RMA request')

  getRmaRequestById.mockClear()

  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

  await waitFor(() => {
    expect(getRmaRequestById).toHaveBeenCalledWith('RMA-9999')
  })
})

test('shows loading skeleton while the RMA Request loads', () => {
  getRmaRequestById.mockReturnValue(new Promise(() => {}))

  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-2026-1002" />)

  expect(
    screen.getByRole('article', { name: 'Loading RMA Request' }),
  ).toBeInTheDocument()
})

test('select status change updates draft and enables save', async () => {
  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-2026-1002" />)

  await screen.findByText('Mina Patel')

  const statusField = screen.getByRole('combobox', { name: 'Status' })

  expect(statusField).toHaveTextContent('Approved')

  fireEvent.click(statusField)
  fireEvent.click(screen.getByRole('option', { name: /Pending/ }))

  expect(statusField).toHaveTextContent('Pending')
})

test('save is disabled when draft matches persisted status initially', async () => {
  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-2026-1002" />)

  await screen.findByText('Mina Patel')

  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
})

test('save is enabled after status change', async () => {
  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-2026-1002" />)

  await screen.findByText('Mina Patel')

  fireEvent.click(screen.getByRole('combobox', { name: 'Status' }))
  fireEvent.click(screen.getByRole('option', { name: /Pending/ }))

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Save' })).not.toBeDisabled()
  })
})

test('successful save shows toast and navigates to list', async () => {
  updateRmaRequest.mockResolvedValue({ ...request, status: 'Rejected' })

  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-2026-1002" />)

  await screen.findByText('Mina Patel')

  fireEvent.click(screen.getByRole('combobox', { name: 'Status' }))
  fireEvent.click(screen.getByRole('option', { name: /Rejected/ }))

  fireEvent.click(screen.getByRole('button', { name: 'Save' }))

  await waitFor(() => {
    expect(updateRmaRequest).toHaveBeenCalledWith('RMA-2026-1002', {
      status: 'Rejected',
    })
  })

  await waitFor(() => {
    expect(toastSuccess).toHaveBeenCalledWith(
      'RMA saved',
      'The request was created or updated successfully.',
    )
  })

  expect(navigate).toHaveBeenCalledWith({ to: '/rma' })
})

test('save error stays visible on screen', async () => {
  updateRmaRequest.mockRejectedValue(new Error('RMA request not found'))

  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-2026-1002" />)

  await screen.findByText('Mina Patel')

  fireEvent.click(screen.getByRole('combobox', { name: 'Status' }))
  fireEvent.click(screen.getByRole('option', { name: /Rejected/ }))

  fireEvent.click(screen.getByRole('button', { name: 'Save' }))

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('RMA request not found')
  })

  expect(screen.getByText('Mina Patel')).toBeInTheDocument()
})

test('cancel navigates back to list', async () => {
  renderWithQueryClient(<RmaUpdateContainer rmaId="RMA-2026-1002" />)

  await screen.findByText('Mina Patel')

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

  expect(navigate).toHaveBeenCalledWith({ to: '/rma' })
})
