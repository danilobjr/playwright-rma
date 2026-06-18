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

import { RmaListContainer } from './rma-list.container'

const { toastSuccess } = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
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
  localStorage.clear()
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
  await waitFor(() => {
    expect(
      screen.queryByRole('link', { name: 'RMA-2026-1001' }),
    ).not.toBeInTheDocument()
  })
  expect(
    within(
      screen.getByRole('article', { name: 'Total RMAs summary' }),
    ).getByText('1'),
  ).toBeInTheDocument()
})
