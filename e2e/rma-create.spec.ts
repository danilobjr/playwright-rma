import { expect, test, type Locator } from '@playwright/test'

async function getRequiredBox(locator: Locator) {
  const box = await locator.boundingBox()

  expect(box).not.toBeNull()

  if (!box) {
    throw new Error('Expected locator to have a bounding box')
  }

  return box
}

async function expectSameRow(firstLocator: Locator, secondLocator: Locator) {
  const firstBox = await getRequiredBox(firstLocator)
  const secondBox = await getRequiredBox(secondLocator)

  expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThanOrEqual(2)
  expect(secondBox.x).toBeGreaterThan(firstBox.x)
}

async function expectStackedBelow(
  firstLocator: Locator,
  secondLocator: Locator,
) {
  const firstBox = await getRequiredBox(firstLocator)
  const secondBox = await getRequiredBox(secondLocator)

  expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height)
}

test('creates a Pending RMA Request end-to-end', async ({ page }) => {
  const currentYear = new Date().getFullYear()
  const nextRmaId = `RMA-${currentYear}-1003`

  await page.goto('/#/rma/create')

  await expect(page.getByLabel('RMA ID')).toHaveValue(nextRmaId)
  await expect(page.getByText('Pending', { exact: true })).toBeVisible()

  await page.getByLabel('Customer name').fill('Jordan Lee')
  await page.getByLabel('Product ID').fill('a1b2')
  await expect(page.getByLabel('Product ID')).toHaveValue('A1B2')
  await page.getByLabel('Reason').fill('Screen flickers after startup.')
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page).toHaveURL(/#\/rma$/)
  const row = page.getByRole('row', {
    name: new RegExp(`${nextRmaId} Jordan Lee`),
  })

  await expect(row.getByRole('link', { name: nextRmaId })).toBeVisible()
  await expect(row.getByRole('link', { name: 'Jordan Lee' })).toBeVisible()
  await expect(row.getByRole('link', { name: 'PRD-A1B2' })).toBeVisible()
  await expect(
    row.getByRole('link', { name: 'Screen flickers after startup.' }),
  ).toBeVisible()
  await expect(page.getByText('RMA saved')).toBeVisible()
})

test('keeps create form responsive across desktop and mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/#/rma/create')

  await expectSameRow(
    page.getByText('RMA ID', { exact: true }),
    page.getByText('Status', { exact: true }),
  )
  await expectSameRow(
    page.getByText('Customer name', { exact: true }),
    page.getByText('Product ID', { exact: true }),
  )

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#/rma/create')

  await expectStackedBelow(
    page.getByText('RMA ID', { exact: true }),
    page.getByText('Status', { exact: true }),
  )
  await expectStackedBelow(
    page.getByText('Customer name', { exact: true }),
    page.getByText('Product ID', { exact: true }),
  )

  await expect(
    page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).resolves.toBe(true)
})

test('requires create form fields before successful creation', async ({
  page,
}) => {
  await page.goto('/#/rma/create')

  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page.getByText('Customer name is required')).toBeVisible()
  await expect(page.getByText('Product ID is required')).toBeVisible()
  await expect(page.getByText('Reason is required')).toBeVisible()
  await expect(page).toHaveURL(/#\/rma\/create$/)
  await expect(page.getByText('RMA saved')).not.toBeVisible()
})

test('shows inline validation errors and preserves entered values', async ({
  page,
}) => {
  await page.goto('/#/rma/create')

  await page.getByLabel('Customer name').fill('Jordan Lee')
  await page.getByLabel('Product ID').fill('a!')
  await page.getByLabel('Reason').fill('Too short')
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page.getByText('Product ID must match PRD-XXXX')).toBeVisible()
  await expect(
    page.getByText('Reason must be at least 10 characters'),
  ).toBeVisible()
  await expect(page.getByLabel('Customer name')).toHaveValue('Jordan Lee')
  await expect(page.getByLabel('Product ID')).toHaveValue('A')
  await expect(page.getByLabel('Reason')).toHaveValue('Too short')
  await expect(page).toHaveURL(/#\/rma\/create$/)
  await expect(page.getByText('RMA saved')).not.toBeVisible()
})

test('blocks duplicate RMA Requests with an inline recovery alert', async ({
  page,
}) => {
  await page.goto('/#/rma/create')

  await page.getByLabel('Customer name').fill('  AVERY   STONE  ')
  await page.getByLabel('Product ID').fill('7f2a')
  await page
    .getByLabel('Reason')
    .fill('Display   panel intermittently turns BLACK during use.')
  await page.getByRole('button', { name: 'Submit' }).click()

  const duplicateAlert = page.getByRole('alert')

  await expect(page).toHaveURL(/#\/rma\/create$/)
  await expect(duplicateAlert.getByText("Couldn't create")).toBeVisible()
  await expect(
    duplicateAlert.getByText('A matching Pending RMA Request already exists.'),
  ).toBeVisible()
  await expect(
    duplicateAlert.getByText(
      'Matching RMA ID: RMA-2026-1001. Status: Pending.',
    ),
  ).toBeVisible()
  await expect(
    duplicateAlert.getByRole('link', { name: 'View matching request' }),
  ).toBeVisible()
  await expect(page.getByLabel('Customer name')).toHaveValue(
    '  AVERY   STONE  ',
  )
  await expect(page.getByLabel('Product ID')).toHaveValue('7F2A')
  await expect(page.getByLabel('Reason')).toHaveValue(
    'Display   panel intermittently turns BLACK during use.',
  )
  await expect(page.getByText('RMA saved')).not.toBeVisible()
})

test('opens the matching request from the duplicate alert', async ({
  page,
}) => {
  await page.goto('/#/rma/create')

  await page.getByLabel('Customer name').fill('Avery Stone')
  await page.getByLabel('Product ID').fill('7f2a')
  await page
    .getByLabel('Reason')
    .fill('Display panel intermittently turns black during use.')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('link', { name: 'View matching request' }).click()

  await expect(page).toHaveURL(/#\/rma\/RMA-2026-1001$/)
})

test('clears the duplicate alert when duplicate fields change', async ({
  page,
}) => {
  await page.goto('/#/rma/create')

  await page.getByLabel('Customer name').fill('Avery Stone')
  await page.getByLabel('Product ID').fill('7f2a')
  await page
    .getByLabel('Reason')
    .fill('Display panel intermittently turns black during use.')
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page.getByRole('alert')).toBeVisible()

  await page.getByLabel('Reason').fill('Different valid reason text.')

  await expect(page.getByRole('alert')).toHaveCount(0)
})
