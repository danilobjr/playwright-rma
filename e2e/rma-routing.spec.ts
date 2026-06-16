import { expect, test } from '@playwright/test'

test('opens the RMA request list route', async ({ page }) => {
  await page.goto('/#/rma')

  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })

  await expect(breadcrumb.getByText('Operations')).toBeVisible()
  await expect(breadcrumb.getByText('RMA', { exact: true })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'RMA Requests' }),
  ).toBeVisible()
  await expect(
    page.getByText(
      'Track return merchandise authorizations, filter by status and date, and start new requests.',
    ),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'New RMA' })).toBeVisible()
})

test('navigates from list to create RMA request shell', async ({ page }) => {
  await page.goto('/#/rma')

  await page.getByRole('link', { name: 'New RMA' }).click()

  await expect(page).toHaveURL(/#\/rma\/create$/)
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })

  await expect(
    page.getByRole('heading', { name: 'Create RMA Request' }),
  ).toBeVisible()
  await expect(breadcrumb.getByText('RMA', { exact: true })).toBeVisible()
  await expect(breadcrumb.getByText('New request')).toBeVisible()
  await expect(
    page.getByText(
      'Use a compact FieldGroup form layout that matches shadcn form composition.',
    ),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Request details' }),
  ).toBeVisible()
  await expect(
    page.getByText('RMA ID is generated automatically'),
  ).toBeVisible()
})

test('returns from create shell to the RMA request list', async ({ page }) => {
  await page.goto('/#/rma/create')

  await page.getByRole('link', { name: 'Back to list' }).click()

  await expect(page).toHaveURL(/#\/rma$/)
  await expect(
    page.getByRole('heading', { name: 'RMA Requests' }),
  ).toBeVisible()

  await page.goto('/#/rma/create')
  await page.getByRole('link', { name: 'Cancel' }).click()

  await expect(page).toHaveURL(/#\/rma$/)
  await expect(
    page.getByRole('heading', { name: 'RMA Requests' }),
  ).toBeVisible()
})

test('opens the dynamic RMA update route placeholder', async ({ page }) => {
  await page.goto('/#/rma/RMA-2026-1047')

  await expect(
    page.getByRole('heading', { name: 'Update RMA Status' }),
  ).toBeVisible()
  await expect(
    page
      .getByRole('navigation', { name: 'Breadcrumb' })
      .getByText('RMA-2026-1047'),
  ).toBeVisible()
  await expect(
    page.getByText('Review the request and choose the next workflow status.'),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Back to requests' }),
  ).toBeVisible()
})

test('does not show the scaffold placeholder', async ({ page }) => {
  await page.goto('/#/rma')

  await expect(
    page.getByText("I'm a useless example page. You can delete me"),
  ).toHaveCount(0)
})
