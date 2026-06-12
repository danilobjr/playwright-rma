import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { useLayout } from './use-layout.hook'

import { Layout } from './layout.app'

function TestPage() {
  useLayout({
    breadcrumbs: ['Operations', 'RMA'],
    title: 'RMA Requests',
    description:
      'Track return merchandise authorizations, filter by status and date, and start new requests.',
    topRightAction: <button type="button">New RMA</button>,
  })

  return <p>Page content</p>
}

test('renders page layout configured by useLayout', async () => {
  render(
    <Layout>
      <TestPage />
    </Layout>,
  )

  expect(await screen.findByText('Operations')).toBeInTheDocument()
  expect(screen.getByText('RMA')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'RMA Requests' })).toBeInTheDocument()
  expect(
    screen.getByText(
      'Track return merchandise authorizations, filter by status and date, and start new requests.',
    ),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'New RMA' })).toBeInTheDocument()
  expect(screen.getByText('Page content')).toBeInTheDocument()
})
