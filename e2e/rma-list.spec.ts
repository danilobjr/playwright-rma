import { expect, test, type Locator, type Page } from '@playwright/test'

async function expectSummaryCard(page: Page, name: string, count: string) {
  const card = page.getByRole('article', { name: `${name} summary` })

  await expect(card.getByRole('heading', { name })).toBeVisible()
  await expect(card.getByText(count, { exact: true })).toBeVisible()
}

async function expectNoHorizontalOverflow(page: Page) {
  await expect(
    page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).resolves.toBe(true)
}

async function expectSummaryOrder(summaryCards: Locator) {
  await expect(summaryCards).toHaveCount(5)
  await expect(
    summaryCards.nth(0).getByRole('heading', { name: 'Total RMAs' }),
  ).toBeVisible()
  await expect(
    summaryCards.nth(1).getByRole('heading', { name: 'Pending' }),
  ).toBeVisible()
  await expect(
    summaryCards.nth(2).getByRole('heading', { name: 'Approved' }),
  ).toBeVisible()
  await expect(
    summaryCards.nth(3).getByRole('heading', { name: 'Rejected' }),
  ).toBeVisible()
  await expect(
    summaryCards.nth(4).getByRole('heading', { name: 'Completed' }),
  ).toBeVisible()
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

async function expectFilterActionWidth(
  page: Page,
  name: 'Search' | 'Reset',
  predicate: (width: number) => boolean,
) {
  const box = await page.getByRole('button', { name }).boundingBox()

  expect(box).not.toBeNull()
  expect(predicate(box?.width ?? 0)).toBe(true)
}

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
  await expectSummaryCard(page, 'Total RMAs', '2')
  await expectSummaryCard(page, 'Pending', '1')
  await expectSummaryCard(page, 'Approved', '1')
  await expectSummaryCard(page, 'Rejected', '0')
  await expectSummaryCard(page, 'Completed', '0')
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
  await expectSummaryCard(page, 'Total RMAs', '3')
  await expectSummaryCard(page, 'Pending', '2')
  await expectSummaryCard(page, 'Approved', '1')
  await expectSummaryCard(page, 'Rejected', '0')
  await expectSummaryCard(page, 'Completed', '0')
})

test('keeps RMA status summary usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#/rma')

  await expectSummaryOrder(page.getByRole('article', { name: /summary$/ }))
  await expectSummaryCard(page, 'Total RMAs', '2')
  await expectSummaryCard(page, 'Pending', '1')
  await expectSummaryCard(page, 'Approved', '1')
  await expectSummaryCard(page, 'Rejected', '0')
  await expectSummaryCard(page, 'Completed', '0')
  await expectNoHorizontalOverflow(page)
})

test('shows stacked RMA Request cards on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#/rma')

  await expect(page.getByRole('table', { name: 'RMA Requests' })).toHaveCount(0)

  const card = page.getByRole('article', { name: 'RMA Request RMA-2026-1002' })

  await expect(card).toBeVisible()
  await expect(card.getByText('RMA ID', { exact: true })).toBeVisible()
  await expect(card.getByRole('link', { name: 'RMA-2026-1002' })).toBeVisible()
  await expect(card.getByText('Customer name', { exact: true })).toBeVisible()
  await expect(card.getByRole('link', { name: 'Mina Patel' })).toBeVisible()
  await expect(card.getByText('Product ID', { exact: true })).toBeVisible()
  await expect(card.getByRole('link', { name: 'PRD-9C4D' })).toBeVisible()
  await expect(card.getByText('Reason', { exact: true })).toBeVisible()
  await expect(card.getByRole('link', { name: /Battery/ })).toBeVisible()
  await expect(card.getByText('Status', { exact: true })).toBeVisible()
  await expect(card.getByRole('link', { name: 'Approved' })).toBeVisible()
  await expect(card.getByText('Submitted date', { exact: true })).toBeVisible()
  await expect(card.getByText('Actions', { exact: true })).toBeVisible()
  await expect(card.getByRole('link', { name: 'Update' })).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await card.getByRole('link', { name: 'Approved' }).click()

  await expect(page).toHaveURL(/#\/rma\/RMA-2026-1002$/)
})

test('shows mobile filter action labels and compact desktop actions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#/rma')

  await expect(page.getByRole('button', { name: 'Search' })).toContainText(
    'Search',
  )
  await expect(page.getByRole('button', { name: 'Reset' })).toContainText(
    'Reset',
  )
  await expectFilterActionWidth(page, 'Search', (width) => width > 100)
  await expectFilterActionWidth(page, 'Reset', (width) => width > 100)

  await page.setViewportSize({ width: 1280, height: 800 })

  await expectFilterActionWidth(page, 'Search', (width) => width <= 44)
  await expectFilterActionWidth(page, 'Reset', (width) => width <= 44)
  await page.getByRole('button', { name: 'Search' }).focus()
  await expect(page.getByRole('tooltip', { name: 'Search' })).toBeVisible()
  await page.getByRole('button', { name: 'Reset' }).focus()
  await expect(page.getByRole('tooltip', { name: 'Reset' })).toBeVisible()
})

test('filters RMA Requests only after Search is clicked', async ({ page }) => {
  await page.goto('/#/rma')
  const table = page.getByRole('table', { name: 'RMA Requests' })

  await expectRmaTableColumns(page)
  await expectRmaOrder(page, ['RMA-2026-1002', 'RMA-2026-1001'])

  await page.getByRole('textbox', { name: 'Search' }).fill('battery')
  await expect(table.getByText('Avery Stone')).toBeVisible()
  await expect(table.getByText('Mina Patel')).toBeVisible()

  await page.getByRole('button', { name: 'Search' }).click()
  await expectRmaOrder(page, ['RMA-2026-1002'])
  await expect(table.getByText('Avery Stone')).toHaveCount(0)
})

test('links RMA Request table content to update screen', async ({ page }) => {
  await page.goto('/#/rma')

  const row = page.getByRole('row', { name: /RMA-2026-1002 Mina Patel/ })

  await expect(row.getByRole('link', { name: 'RMA-2026-1002' })).toBeVisible()
  await expect(row.getByRole('link', { name: 'Mina Patel' })).toBeVisible()
  await expect(row.getByRole('link', { name: 'PRD-9C4D' })).toBeVisible()
  await expect(row.getByRole('link', { name: 'Approved' })).toBeVisible()

  await row.getByRole('link', { name: 'Approved' }).click()

  await expect(page).toHaveURL(/#\/rma\/RMA-2026-1002$/)
})

test('deletes an RMA Request after accessible confirmation', async ({
  page,
}) => {
  await page.goto('/#/rma')

  const row = page.getByRole('row', { name: /RMA-2026-1001 Avery Stone/ })
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
      'This will remove RMA Request RMA-2026-1001 for Avery Stone from the list. You cannot restore it after deleting.',
    ),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(row.getByRole('link', { name: 'RMA-2026-1001' })).toBeVisible()

  await deleteButton.click()
  await page.getByRole('button', { name: 'Delete request' }).click()

  await expect(page.getByText('RMA Request deleted')).toBeVisible()
  await expect(page.getByRole('link', { name: 'RMA-2026-1001' })).toHaveCount(0)
  await expectSummaryCard(page, 'Total RMAs', '1')
  await expectSummaryCard(page, 'Pending', '0')
  await expectRmaOrder(page, ['RMA-2026-1002'])

  await page.reload()

  await expect(page.getByRole('link', { name: 'RMA-2026-1001' })).toHaveCount(0)
  await expectRmaOrder(page, ['RMA-2026-1002'])
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

  await expectRmaOrder(page, ['RMA-2026-1002'])

  await page.getByRole('textbox', { name: 'Search' }).fill('battery')
  await page.getByRole('button', { name: 'Pending summary' }).click()
  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  await expect(page.getByRole('combobox', { name: 'Status' })).toContainText(
    'Pending',
  )
  await expectRmaOrder(page, ['RMA-2026-1001'])

  await page.getByRole('button', { name: 'Total RMAs summary' }).click()
  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  await expect(page.getByRole('combobox', { name: 'Status' })).toContainText(
    'Status',
  )
  await expectRmaOrder(page, ['RMA-2026-1002', 'RMA-2026-1001'])
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
    'Status',
  )
  await expectRmaOrder(page, ['RMA-2026-1002', 'RMA-2026-1001'])
})

test('shows tooltips for filter actions', async ({ page }) => {
  await page.goto('/#/rma')

  await page.getByRole('button', { name: 'Search' }).focus()
  await expect(page.getByRole('tooltip', { name: 'Search' })).toBeVisible()

  await page.getByRole('button', { name: 'Reset' }).focus()
  await expect(page.getByRole('tooltip', { name: 'Reset' })).toBeVisible()
})

test('delete then create does not reuse the removed RMA ID', async ({
  page,
}) => {
  const currentYear = new Date().getFullYear()

  await page.goto('/#/rma/create')
  await expect(page.getByLabel('RMA ID')).toHaveValue(`RMA-${currentYear}-1003`)

  await page.getByLabel('Customer name').fill('Test User')
  await page.getByLabel('Product ID').fill('a1b2')
  await page.getByLabel('Reason').fill('Product requires thorough evaluation.')
  await page.getByRole('button', { name: 'Submit' }).click()

  await page.goto('/#/rma')
  const row = page.getByRole('row', {
    name: new RegExp(`RMA-${currentYear}-1003 Test User`),
  })
  await row.getByRole('button', { name: 'Delete request' }).click()
  await page.getByRole('button', { name: 'Delete request' }).click()
  await expect(page.getByText('RMA Request deleted')).toBeVisible()

  await page.goto('/#/rma/create')
  await expect(page.getByLabel('RMA ID')).toHaveValue(`RMA-${currentYear}-1004`)
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
