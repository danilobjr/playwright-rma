import { expect, test } from 'vitest'

import type { RmaStatus } from '../../models/rma-request.model'
import {
  RMA_STATUS_DISPLAY,
  RMA_STATUS_ORDER,
} from './rma-status-presentation.model'

test('defines shared presentation for every RMA status in workflow order', () => {
  expect(RMA_STATUS_ORDER).toEqual<RmaStatus[]>([
    'Pending',
    'Approved',
    'Rejected',
    'Completed',
  ])

  for (const status of RMA_STATUS_ORDER) {
    expect(RMA_STATUS_DISPLAY[status]).toMatchObject({
      label: status,
      description: expect.any(String),
      className: expect.any(String),
    })
    expect(RMA_STATUS_DISPLAY[status].icon).toBeDefined()
  }

  expect(
    Object.fromEntries(
      RMA_STATUS_ORDER.map((status) => [
        status,
        RMA_STATUS_DISPLAY[status].description,
      ]),
    ),
  ).toEqual({
    Pending: 'Awaiting review',
    Approved: 'Return is authorized',
    Rejected: 'Request is declined',
    Completed: 'Return workflow is closed',
  })
})
