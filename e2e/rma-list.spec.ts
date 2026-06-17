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

  await page.getByLabel('Customer Name').fill('Jordan Lee')
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
