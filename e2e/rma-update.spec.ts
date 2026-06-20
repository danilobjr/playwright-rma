import { expect, test } from '@playwright/test'

async function expectNoHorizontalOverflow(
  page: import('@playwright/test').Page,
) {
  await expect(
    page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).resolves.toBe(true)
}

async function navigateToUpdatePage(page: import('@playwright/test').Page) {
  await page.setViewportSize({ width: 1280, height: 1500 })
  await page.goto('/#/rma/RMA-2026-1002')

  await expect(
    page.getByRole('article', { name: 'RMA Request RMA-2026-1002' }),
  ).toBeVisible()
}

async function selectStatus(
  page: import('@playwright/test').Page,
  name: string,
) {
  await page.getByRole('combobox', { name: 'Status' }).click()
  // Radix portal is position:fixed below viewport — click via evaluate
  await page.evaluate((statusName: string) => {
    for (const opt of document.querySelectorAll('[role="option"]')) {
      if (opt.textContent?.includes(statusName)) {
        ;(opt as HTMLElement).click()
        break
      }
    }
  }, name)
}

test('updates status from Approved to Rejected and shows change in list', async ({
  page,
}) => {
  await navigateToUpdatePage(page)
  await selectStatus(page, 'Rejected')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page).toHaveURL(/#\/rma$/)

  const row = page.getByRole('row', { name: /RMA-2026-1002 Mina Patel/ })

  await expect(row.getByRole('link', { name: 'Rejected' })).toBeVisible()
  await expect(page.getByText('RMA request status updated')).toBeVisible()
})

test('cancel returns to list without changing status', async ({ page }) => {
  await navigateToUpdatePage(page)

  await page.getByRole('button', { name: 'Cancel' }).click()

  await expect(page).toHaveURL(/#\/rma$/)

  const row = page.getByRole('row', { name: /RMA-2026-1002 Mina Patel/ })

  await expect(row.getByRole('link', { name: 'Approved' })).toBeVisible()
})

test('save is disabled when status matches persisted status', async ({
  page,
}) => {
  await navigateToUpdatePage(page)

  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
})

test('save and cancel are usable on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#/rma/RMA-2026-1002')

  await expect(
    page.getByRole('article', { name: 'RMA Request RMA-2026-1002' }),
  ).toBeVisible()

  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('shows updated status on re-entry after save', async ({ page }) => {
  await navigateToUpdatePage(page)
  await selectStatus(page, 'Rejected')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page).toHaveURL(/#\/rma$/)

  await page.getByRole('link', { name: 'Rejected' }).click()

  await expect(
    page.getByRole('article', { name: 'RMA Request RMA-2026-1002' }),
  ).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'Status' })).toContainText(
    'Rejected',
  )
})
