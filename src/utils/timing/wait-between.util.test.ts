import { describe, expect, it, vi } from 'vitest'

import { waitBetween } from './wait-between.util'

describe('waitBetween', () => {
  it('waits for the lower bound when random returns 0', async () => {
    vi.useFakeTimers()
    const wait = waitBetween({ random: () => 0 })
    let settled = false

    wait.then(() => {
      settled = true
    })

    await vi.advanceTimersByTimeAsync(999)
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await wait

    expect(settled).toBe(true)
  })

  it('waits for the upper bound when random returns 1', async () => {
    vi.useFakeTimers()
    const wait = waitBetween({ random: () => 1 })
    let settled = false

    wait.then(() => {
      settled = true
    })

    await vi.advanceTimersByTimeAsync(1_999)
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await wait

    expect(settled).toBe(true)
  })
})
