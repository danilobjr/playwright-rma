import { describe, expect, it } from 'vitest'

import { computePaginationTokens, DOTS } from './compute-pagination-tokens.util'

describe('computePaginationTokens()', () => {
  it('returns full range when totalPages equals totalPageNumbers threshold (no DOTS)', () => {
    const tokens = computePaginationTokens({
      totalPages: 7,
      currentPage: 4,
      siblings: 1,
      boundaries: 1,
    })

    expect(tokens).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('returns full range when totalPages smaller than threshold (no DOTS)', () => {
    const tokens = computePaginationTokens({
      totalPages: 3,
      currentPage: 2,
    })

    expect(tokens).toEqual([1, 2, 3])
  })

  it('returns empty range when totalPages is 0', () => {
    const tokens = computePaginationTokens({
      totalPages: 0,
      currentPage: 1,
    })

    expect(tokens).toEqual([])
  })

  it('shows RIGHT DOTS only when current is near left edge', () => {
    const tokens = computePaginationTokens({
      totalPages: 20,
      currentPage: 2,
      siblings: 1,
      boundaries: 1,
    })

    expect(tokens).toEqual([1, 2, 3, 4, 5, DOTS, 20])
  })

  it('shows RIGHT DOTS with larger siblings and boundaries', () => {
    const tokens = computePaginationTokens({
      totalPages: 30,
      currentPage: 3,
      siblings: 2,
      boundaries: 2,
    })

    const expected = [
      ...Array.from({ length: 8 }, (_, i) => i + 1),
      DOTS,
      29,
      30,
    ]

    expect(tokens).toEqual(expected)
  })

  it('shows LEFT DOTS only when current is near right edge', () => {
    const tokens = computePaginationTokens({
      totalPages: 20,
      currentPage: 19,
      siblings: 1,
      boundaries: 1,
    })

    expect(tokens).toEqual([1, DOTS, 16, 17, 18, 19, 20])
  })

  it('shows LEFT DOTS with different siblings and boundaries', () => {
    const tokens = computePaginationTokens({
      totalPages: 25,
      currentPage: 24,
      siblings: 2,
      boundaries: 2,
    })

    expect(tokens).toEqual([1, 2, DOTS, 18, 19, 20, 21, 22, 23, 24, 25])
  })

  it('shows BOTH DOTS when current is in middle', () => {
    const tokens = computePaginationTokens({
      totalPages: 50,
      currentPage: 25,
      siblings: 1,
      boundaries: 1,
    })

    expect(tokens).toEqual([1, DOTS, 24, 25, 26, DOTS, 50])
  })

  it('shows BOTH DOTS with larger siblings and boundaries', () => {
    const tokens = computePaginationTokens({
      totalPages: 50,
      currentPage: 25,
      siblings: 3,
      boundaries: 2,
    })
    const leftSiblingIndex = Math.max(25 - 3, 2)
    const rightSiblingIndex = Math.min(25 + 3, 50 - 2)
    const middle = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    )

    const expected = [1, 2, DOTS, ...middle, DOTS, 49, 50]
    expect(tokens).toEqual(expected)
  })

  it('truncates non-integer totalPages via Math.trunc', () => {
    const tokens = computePaginationTokens({
      totalPages: 7.9,
      currentPage: 4,
    })

    expect(tokens).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('treats negative totalPages as 0 (empty range)', () => {
    const tokens = computePaginationTokens({
      totalPages: -5,
      currentPage: 1,
    })

    expect(tokens).toEqual([])
  })

  it('handles siblings = 0 and boundaries = 0', () => {
    const tokens = computePaginationTokens({
      totalPages: 10,
      currentPage: 5,
      siblings: 0,
      boundaries: 0,
    })

    expect(tokens).toContain(5)

    const dotsCount = tokens.filter((token) => token === DOTS).length
    expect(dotsCount).toBeGreaterThanOrEqual(1)

    const numericSegments: number[][] = []
    let seq: number[] = []

    for (const token of tokens) {
      if (token === DOTS) {
        if (seq.length) {
          numericSegments.push(seq)
          seq = []
        }
      } else {
        seq.push(token as number)
      }
    }

    if (seq.length) {
      numericSegments.push(seq)
    }

    numericSegments.forEach((s) => {
      for (let i = 1; i < s.length; i++) {
        expect(s[i]).toBeGreaterThan(s[i - 1])
      }
    })
  })

  it('siblings larger than totalPages results in full range', () => {
    const tokens = computePaginationTokens({
      totalPages: 5,
      currentPage: 3,
      siblings: 10,
    })

    expect(tokens).toEqual([1, 2, 3, 4, 5])
  })

  it('preserves active-like currentPage (range computed from _total even if current out of range)', () => {
    const tokens1 = computePaginationTokens({
      totalPages: 5,
      currentPage: 10,
    })

    expect(tokens1).toEqual([1, 2, 3, 4, 5])

    const tokens2 = computePaginationTokens({
      totalPages: 5,
      currentPage: 0,
    })

    expect(tokens2).toEqual([1, 2, 3, 4, 5])
  })

  it('DOTS items are the exact DOTS token (string) and not numbers', () => {
    const tokens = computePaginationTokens({
      totalPages: 20,
      currentPage: 10,
      siblings: 1,
      boundaries: 1,
    })

    const dots = tokens.filter((token) => token === DOTS)
    expect(dots.length).toBeGreaterThanOrEqual(1)

    dots.forEach((d) => expect(typeof d).toBe('string'))
  })

  it('numeric segments in range are strictly ascending and DOTS separate ascending blocks', () => {
    const configs = [
      { totalPages: 20, currentPage: 2, siblings: 1, boundaries: 1 },
      { totalPages: 20, currentPage: 19, siblings: 1, boundaries: 1 },
      { totalPages: 50, currentPage: 25, siblings: 1, boundaries: 1 },
    ]

    for (const cfg of configs) {
      const tokens = computePaginationTokens(cfg)
      const numericBlocks: number[][] = []
      let block: number[] = []
      for (const token of tokens) {
        if (token === DOTS) {
          if (block.length) {
            numericBlocks.push(block)
            block = []
          }
        } else {
          block.push(token as number)
        }
      }
      if (block.length) {
        numericBlocks.push(block)
      }

      numericBlocks.forEach((b) => {
        for (let i = 1; i < b.length; i++) {
          expect(b[i]).toBeGreaterThan(b[i - 1])
        }
      })
    }
  })

  it('large totalPages produces a small range that contains DOTS and the first/last pages', () => {
    const largeTotal = 100000
    const tokens = computePaginationTokens({
      totalPages: largeTotal,
      currentPage: 50000,
      siblings: 2,
      boundaries: 2,
    })

    expect(tokens.length).toBeLessThan(1000)
    expect(tokens[0]).toBe(1)
    expect(tokens[tokens.length - 1]).toBe(largeTotal)
    expect(tokens).toContain(DOTS)
  })

  it('repeated range computations are deterministic (same inputs produce same outputs)', () => {
    const input = {
      totalPages: 30,
      currentPage: 10,
      siblings: 2,
      boundaries: 1,
    }

    const tokens1 = computePaginationTokens(input)
    const tokens2 = computePaginationTokens(input)

    expect(tokens1).toEqual(tokens2)
  })
})
