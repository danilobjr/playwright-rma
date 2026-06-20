import { type ReactNode } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import type { RmaRequest } from '@/services/api/rma/rma-request.model'

import { RmaUpdatePage } from './rma-update.page'

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
}))

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

test('shows not-found state when no request data and not loading', () => {
  render(<RmaUpdatePage />)

  expect(
    screen.getByRole('heading', { name: 'RMA request not found' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText('Check the RMA ID or return to the request list.'),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'Back to requests' }),
  ).toHaveAttribute('href', '/rma')
})

test('shows load-error state with Try again and Back to requests', () => {
  render(
    <RmaUpdatePage
      isError
      error={new Error('Network failure')}
      onRetry={vi.fn()}
    />,
  )

  expect(
    screen.getByRole('heading', { name: 'Unable to load RMA request' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText('Try again or return to the request list.'),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'Back to requests' }),
  ).toHaveAttribute('href', '/rma')
})

test('Try again calls onRetry callback', () => {
  const onRetry = vi.fn()
  render(<RmaUpdatePage isError error={new Error('fail')} onRetry={onRetry} />)

  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

  expect(onRetry).toHaveBeenCalledOnce()
})

test('starts Status select with saved Status and keeps options closed by default', () => {
  render(<RmaUpdatePage request={request} draftStatus="Approved" />)

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

test('badge shows persisted status even when draft differs', () => {
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Rejected"
      onStatusChange={vi.fn()}
    />,
  )

  const card = screen.getByRole('article', {
    name: 'RMA Request RMA-2026-1002',
  })

  expect(within(card).getByText('Approved')).toBeInTheDocument()
})

test('select shows draft status', () => {
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Rejected"
      onStatusChange={vi.fn()}
    />,
  )

  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
    'Rejected',
  )
})

test('save is disabled when draft matches persisted status', () => {
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Approved"
      saveDisabled={true}
      onSave={vi.fn()}
      onCancel={vi.fn()}
    />,
  )

  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
})

test('save is disabled while update is pending', () => {
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Rejected"
      isSaving={true}
      saveDisabled={false}
      onSave={vi.fn()}
      onCancel={vi.fn()}
    />,
  )

  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
})

test('save label stays Save while pending', () => {
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Rejected"
      isSaving={true}
      saveDisabled={false}
      onSave={vi.fn()}
      onCancel={vi.fn()}
    />,
  )

  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
})

test('save calls onSave callback', () => {
  const onSave = vi.fn()
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Rejected"
      saveDisabled={false}
      onSave={onSave}
      onCancel={vi.fn()}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Save' }))

  expect(onSave).toHaveBeenCalledOnce()
})

test('cancel calls onCancel callback', () => {
  const onCancel = vi.fn()
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Approved"
      onCancel={onCancel}
      onSave={vi.fn()}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

  expect(onCancel).toHaveBeenCalledOnce()
})

test('shows save error alert when saveError is set', () => {
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Rejected"
      saveError="RMA request not found"
      onSave={vi.fn()}
      onCancel={vi.fn()}
    />,
  )

  expect(screen.getByRole('alert')).toHaveTextContent('RMA request not found')
})

test('changing select calls onStatusChange with new status', () => {
  const onStatusChange = vi.fn()
  render(
    <RmaUpdatePage
      request={request}
      draftStatus="Approved"
      onStatusChange={onStatusChange}
      onSave={vi.fn()}
      onCancel={vi.fn()}
    />,
  )

  const statusField = screen.getByRole('combobox', { name: 'Status' })

  fireEvent.click(statusField)
  fireEvent.click(screen.getByRole('option', { name: /Pending/ }))

  expect(onStatusChange).toHaveBeenCalledWith('Pending')
})
