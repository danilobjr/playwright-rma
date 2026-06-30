import { expect, test, type Locator, type Page } from '@playwright/test'

async function expectSummaryCard(page: Page, name: string, count: string) {
  const card = page.getByRole('article', { name: `${name} summary` })

  await expect(card.getByText(name, { exact: true })).toBeVisible()
  await expect(card.getByText(count, { exact: true })).toBeVisible()
}

async function expectSummaryOrder(summaryCards: Locator) {
  await expect(summaryCards).toHaveCount(4)
  await expect(summaryCards.nth(0)).toContainText('Total RMAs')
  await expect(summaryCards.nth(1)).toContainText('Pending')
  await expect(summaryCards.nth(2)).toContainText('Approved')
  await expect(summaryCards.nth(3)).toContainText('Completed')
}

async function expectRmaOrder(page: Page, rmaIds: string[]) {
  const rmaLinks = page.getByRole('link', { name: /^RMA-\d{4}-\d{4}$/ })

  await expect(rmaLinks).toHaveCount(rmaIds.length)

  for (const [index, rmaId] of rmaIds.entries()) {
    await expect(rmaLinks.nth(index)).toHaveText(rmaId)
  }
}

async function expectRmaTableColumns(page: Page) {
  await expect(page.getByRole('table', { name: 'RMA Requests' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'RMA ID' })).toBeVisible()
  await expect(
    page.getByRole('columnheader', { name: 'Customer name' }),
  ).toBeVisible()
  await expect(
    page.getByRole('columnheader', { name: 'Product ID' }),
  ).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Reason' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible()
  await expect(
    page.getByRole('columnheader', { name: 'Submitted date' }),
  ).toBeVisible()
  await expect(
    page.getByRole('columnheader', { name: 'Actions' }),
  ).toBeVisible()
}

const firstPageRmaIds = [
  'RMA-2026-1012',
  'RMA-2026-1011',
  'RMA-2026-1010',
  'RMA-2026-1009',
  'RMA-2026-1008',
  'RMA-2026-1007',
  'RMA-2026-1006',
  'RMA-2026-1005',
  'RMA-2026-1004',
  'RMA-2026-1003',
]

const firstPageAfterDeletingNewestRmaIds = [
  'RMA-2026-1011',
  'RMA-2026-1010',
  'RMA-2026-1009',
  'RMA-2026-1008',
  'RMA-2026-1007',
  'RMA-2026-1006',
  'RMA-2026-1005',
  'RMA-2026-1004',
  'RMA-2026-1003',
  'RMA-2026-1002',
]

async function goToCalendarMonth(page: Page, targetMonth: string) {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const visibleMonth = await page.getByRole('status').textContent()

    if (visibleMonth === targetMonth) {
      return
    }

    await page
      .getByRole('button', {
        name:
          new Date(`${visibleMonth ?? ''} 1`) > new Date(`${targetMonth} 1`)
            ? 'Go to the Previous Month'
            : 'Go to the Next Month',
      })
      .click()
  }

  throw new Error(`Could not navigate calendar to ${targetMonth}`)
}

test('shows RMA status summary counts in workflow order', async ({ page }) => {
  await page.goto('/#/rma')

  await expect(
    page.getByRole('heading', { name: 'RMA Requests' }),
  ).toBeVisible()
  await expect(page.getByText(/dashboard/i)).toHaveCount(0)
  await expectSummaryOrder(page.getByRole('article', { name: /summary$/ }))
  await expectSummaryCard(page, 'Total RMAs', '12')
  await expectSummaryCard(page, 'Pending', '4')
  await expectSummaryCard(page, 'Approved', '3')
  await expectSummaryCard(page, 'Completed', '2')
})

test('updates RMA status summary after creating a Pending request', async ({
  page,
}) => {
  await page.goto('/#/rma/create')

  await page.getByLabel('Customer name').fill('Jordan Lee')
  await page.getByLabel('Product ID').fill('b7c8')
  await page.getByLabel('Reason').fill('Screen flickers after startup.')
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page).toHaveURL(/#\/rma$/)
  await expectSummaryCard(page, 'Total RMAs', '13')
  await expectSummaryCard(page, 'Pending', '5')
  await expectSummaryCard(page, 'Approved', '2')
  await expectSummaryCard(page, 'Completed', '2')
})

test('filters RMA Requests only after Search is clicked', async ({ page }) => {
  await page.goto('/#/rma')
  const table = page.getByRole('table', { name: 'RMA Requests' })

  await expectRmaTableColumns(page)
  await expectRmaOrder(page, firstPageRmaIds)

  await page.getByRole('textbox', { name: 'Search' }).fill('battery')
  await expect(table.getByText('Drew Anderson')).toBeVisible()
  await expect(table.getByText('Quinn Martinez')).toBeVisible()

  await page.getByRole('button', { name: 'Search' }).click()
  await expectRmaOrder(page, ['RMA-2026-1002'])
  await expect(table.getByText('Drew Anderson')).toHaveCount(0)
})

test('links RMA Request table content to update screen', async ({ page }) => {
  await page.goto('/#/rma')

  const row = page.getByRole('row', { name: /RMA-2026-1012 Drew Anderson/ })

  await expect(row.getByRole('link', { name: 'RMA-2026-1012' })).toBeVisible()
  await expect(row.getByRole('link', { name: 'Drew Anderson' })).toBeVisible()
  await expect(row.getByRole('link', { name: 'PRD-1F8B' })).toBeVisible()
  await expect(row.getByRole('link', { name: 'Pending' })).toBeVisible()

  await row.getByRole('link', { name: 'Pending' }).click()

  await expect(page).toHaveURL(/#\/rma\/RMA-2026-1012$/)
})

test('deletes an RMA Request after accessible confirmation', async ({
  page,
}) => {
  await page.goto('/#/rma')

  const row = page.getByRole('row', { name: /RMA-2026-1012 Drew Anderson/ })
  const deleteButton = row.getByRole('button', { name: 'Delete request' })

  await deleteButton.focus()
  await expect(
    page.getByRole('tooltip', { name: 'Delete request' }),
  ).toBeVisible()

  await deleteButton.click()
  await expect(
    page.getByRole('heading', { name: 'Delete RMA Request?' }),
  ).toBeVisible()
  await expect(
    page.getByText(
      'This will remove RMA Request RMA-2026-1012 for Drew Anderson from the list. You cannot restore it after deleting.',
    ),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(row.getByRole('link', { name: 'RMA-2026-1012' })).toBeVisible()

  await deleteButton.click()
  await page.getByRole('button', { name: 'Delete request' }).click()

  await expect(page.getByText('RMA deleted')).toBeVisible()
  await expect(page.getByRole('link', { name: 'RMA-2026-1012' })).toHaveCount(0)
  await expectSummaryCard(page, 'Total RMAs', '12')
  await expectSummaryCard(page, 'Pending', '3')
  await expectRmaOrder(page, firstPageAfterDeletingNewestRmaIds)

  await page.reload()

  await expect(page.getByRole('link', { name: 'RMA-2026-1012' })).toHaveCount(0)
  await expectRmaOrder(page, firstPageAfterDeletingNewestRmaIds)
})

test('filters by Status and keeps summary cards in sync', async ({ page }) => {
  await page.goto('/#/rma')

  await page.getByRole('combobox', { name: 'Status' }).click()
  await expect(page.getByRole('option', { name: /All/ })).toHaveCount(0)
  await expect(page.getByRole('option', { name: /Pending/ })).toBeVisible()
  await expect(page.getByRole('option', { name: /Approved/ })).toBeVisible()
  await expect(page.getByRole('option', { name: /Rejected/ })).toBeVisible()
  await expect(page.getByRole('option', { name: /Completed/ })).toBeVisible()
  await page.getByRole('option', { name: /Approved/ }).click()
  await page.getByRole('button', { name: 'Search' }).click()

  await expectRmaOrder(page, [
    'RMA-2026-1011',
    'RMA-2026-1008',
    'RMA-2026-1003',
    'RMA-2026-1002',
  ])

  await page.getByRole('combobox', { name: 'Status' }).click()
  await page.getByRole('option', { name: /Pending/ }).click()
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  await expect(page.getByRole('combobox', { name: 'Status' })).toContainText(
    'Pending',
  )
  await expectRmaOrder(page, [
    'RMA-2026-1012',
    'RMA-2026-1009',
    'RMA-2026-1007',
    'RMA-2026-1006',
    'RMA-2026-1001',
  ])

  await page.getByRole('button', { name: 'Reset' }).click()
  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  await expect(page.getByRole('combobox', { name: 'Status' })).toContainText(
    'All',
  )
  await expectRmaOrder(page, firstPageRmaIds)
})

test('filters by Submitted date and resets filters', async ({ page }) => {
  await page.goto('/#/rma')

  await page.getByRole('button', { name: 'Submitted date' }).click()
  await goToCalendarMonth(page, 'February 2026')
  await page.getByRole('button', { name: 'Sunday, February 8th, 2026' }).click()
  await page.getByRole('button', { name: 'Search' }).click()

  await expectRmaOrder(page, ['RMA-2026-1002'])

  await page.getByRole('button', { name: 'Reset' }).click()

  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  await expect(page.getByRole('combobox', { name: 'Status' })).toContainText(
    'All',
  )
  await expectRmaOrder(page, firstPageRmaIds)
})

test('delete then create does not reuse the removed RMA ID', async ({
  page,
}) => {
  const currentYear = new Date().getFullYear()

  await page.goto('/#/rma/create')
  await expect(page.getByLabel('RMA ID')).toHaveValue(`RMA-${currentYear}-1013`)

  await page.getByLabel('Customer name').fill('Test User')
  await page.getByLabel('Product ID').fill('a1b2')
  await page.getByLabel('Reason').fill('Product requires thorough evaluation.')
  await page.getByRole('button', { name: 'Submit' }).click()

  await page.goto('/#/rma')
  const row = page.getByRole('row', {
    name: new RegExp(`RMA-${currentYear}-1013 Test User`),
  })
  await row.getByRole('button', { name: 'Delete request' }).click()
  await page.getByRole('button', { name: 'Delete request' }).click()
  await expect(page.getByText('RMA deleted')).toBeVisible()

  await page.goto('/#/rma/create')
  await expect(page.getByLabel('RMA ID')).toHaveValue(`RMA-${currentYear}-1014`)
})

test('shows initial empty state with New RMA action when no requests exist', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const key = 'playwright-rma:rma-requests:v1'
    const originalGetItem = localStorage.getItem.bind(localStorage)
    localStorage.getItem = function (k) {
      if (k === key) return JSON.stringify({ requests: [] })
      return originalGetItem(k)
    }
  })
  await page.goto('/#/rma')

  await expect(page.getByText('No RMA Requests')).toBeVisible()
  await expect(
    page.getByRole('link', { name: /New RMA/ }).first(),
  ).toHaveAttribute('href', /\/rma\/create$/)
})

test('shows filtered empty state with Reset when no results match filters', async ({
  page,
}) => {
  await page.goto('/#/rma')

  await page.getByRole('textbox', { name: 'Search' }).fill('ZZZZN0N3X1STENT')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByText('No RMA Requests found')).toBeVisible()
  await expect(
    page.getByRole('button', { name: /Reset filters/i }),
  ).toBeVisible()
})

test('shows error alert when RMA data is corrupted', async ({ page }) => {
  await page.addInitScript(() => {
    const key = 'playwright-rma:rma-requests:v1'
    const originalGetItem = localStorage.getItem.bind(localStorage)
    localStorage.getItem = function (k) {
      if (k === key) return '{invalid json!!!}'
      return originalGetItem(k)
    }
  })
  await page.goto('/#/rma')

  await expect(page.getByRole('alert')).toContainText(
    "Couldn't load RMA Requests",
    { timeout: 15000 },
  )
})
