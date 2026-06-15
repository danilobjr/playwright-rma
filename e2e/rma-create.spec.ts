import { expect, test } from '@playwright/test'

test('creates a Pending RMA Request end-to-end', async ({ page }) => {
  const currentYear = new Date().getFullYear()
  const nextRmaId = `RMA-${currentYear}-1003`

  await page.goto('/#/rma/create')

  await expect(page.getByLabel('RMA ID')).toHaveValue(nextRmaId)
  await expect(page.getByText('Pending', { exact: true })).toBeVisible()

  await page.getByLabel('Customer Name').fill('Jordan Lee')
  await page.getByLabel('Product ID').fill('PRD-A1B2')
  await page.getByLabel('Reason').fill('Screen flickers after startup.')
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page).toHaveURL(/#\/rma$/)
  await expect(page.getByText(nextRmaId)).toBeVisible()
  await expect(page.getByText('Jordan Lee')).toBeVisible()
  await expect(page.getByText('PRD-A1B2')).toBeVisible()
  await expect(page.getByText('Screen flickers after startup.')).toBeVisible()
})

test('requires create form fields before successful creation', async ({
  page,
}) => {
  await page.goto('/#/rma/create')

  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page.getByText('Customer Name is required')).toBeVisible()
  await expect(page.getByText('Product ID is required')).toBeVisible()
  await expect(page.getByText('Reason is required')).toBeVisible()
  await expect(page).toHaveURL(/#\/rma\/create$/)
})
