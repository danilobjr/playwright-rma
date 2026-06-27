import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { computePaginationTokens } from './compute-pagination-tokens.util'
import { usePagination } from './use-pagination.hook'

describe('usePagination()', () => {
  // ── A — Return Value Shape ────────────────────────────

  it('returns the expected interface keys', () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 1, totalPages: 10 }),
    )

    expect(result.current).toHaveProperty('tokens')
    expect(result.current).toHaveProperty('currentPage')
    expect(result.current).toHaveProperty('setCurrentPage')
    expect(result.current).toHaveProperty('goNext')
    expect(result.current).toHaveProperty('goPrevious')
    expect(result.current).toHaveProperty('goFirst')
    expect(result.current).toHaveProperty('goLast')

    expect(Array.isArray(result.current.tokens)).toBe(true)
    expect(typeof result.current.setCurrentPage).toBe('function')
    expect(typeof result.current.goNext).toBe('function')
    expect(typeof result.current.goPrevious).toBe('function')
    expect(typeof result.current.goFirst).toBe('function')
    expect(typeof result.current.goLast).toBe('function')
  })

  // ── B — Default Values ────────────────────────────────

  it('defaults siblings to 1 when omitted', () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 5, totalPages: 20, boundaries: 2 }),
    )

    const expected = computePaginationTokens({
      totalPages: 20,
      currentPage: 5,
      siblings: 1,
      boundaries: 2,
    })

    expect(result.current.tokens).toEqual(expected)
  })

  it('defaults boundaries to 1 when omitted', () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 5, totalPages: 20, siblings: 2 }),
    )

    const expected = computePaginationTokens({
      totalPages: 20,
      currentPage: 5,
      siblings: 2,
      boundaries: 1,
    })

    expect(result.current.tokens).toEqual(expected)
  })

  it('defaults onChangeCurrentPage to noop when omitted', () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 1, totalPages: 10 }),
    )

    expect(() => {
      result.current.goNext()
      result.current.goPrevious()
      result.current.goFirst()
      result.current.goLast()
      result.current.setCurrentPage(5)
    }).not.toThrow()
  })

  // ── C — totalPages Clamping ───────────────────────────

  it('totalPages 0 produces _total 0 and goLast clamps from 0 to 1', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 5,
        totalPages: 0,
        onChangeCurrentPage: onChange,
      }),
    )

    result.current.goLast()

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('totalPages -1 produces _total 0 and goLast clamps from 0 to 1', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 5,
        totalPages: -1,
        onChangeCurrentPage: onChange,
      }),
    )

    result.current.goLast()

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('totalPages -100 produces _total 0 and goLast clamps from 0 to 1', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 5,
        totalPages: -100,
        onChangeCurrentPage: onChange,
      }),
    )

    result.current.goLast()

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('totalPages 7.0 passes through as exact integer 7', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: 7.0,
        onChangeCurrentPage: onChange,
      }),
    )

    result.current.goLast()

    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('totalPages 7.9 truncates to 7', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: 7.9,
        onChangeCurrentPage: onChange,
      }),
    )

    result.current.goLast()

    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('totalPages 7.1 truncates to 7', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: 7.1,
        onChangeCurrentPage: onChange,
      }),
    )

    result.current.goLast()

    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('handles NaN totalPages without throwing', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: NaN,
        onChangeCurrentPage: onChange,
      }),
    )

    expect(() => {
      result.current.goFirst()
    }).not.toThrow()
  })

  // ── D — Navigation Action Creators ────────────────────

  describe('goNext', () => {
    it('calls onChangeCurrentPage with currentPage + 1', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 5,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goNext()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(6)
    })

    it('clamps to totalPages when at the last page', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 10,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goNext()

      expect(onChange).toHaveBeenCalledWith(10)
    })

    it('clamps to 1 when currentPage is 0', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 0,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goNext()

      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('clamps to 1 when currentPage is negative', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: -1,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goNext()

      expect(onChange).toHaveBeenCalledWith(1)
    })
  })

  describe('goPrevious', () => {
    it('calls onChangeCurrentPage with currentPage - 1', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 5,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goPrevious()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(4)
    })

    it('clamps to 1 when at the first page', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goPrevious()

      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('clamps to 1 when currentPage is 0', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 0,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goPrevious()

      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('clamps to 1 when currentPage is negative', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: -5,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goPrevious()

      expect(onChange).toHaveBeenCalledWith(1)
    })
  })

  describe('goFirst', () => {
    it('calls onChangeCurrentPage with 1', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 5,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goFirst()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('still calls onChangeCurrentPage(1) when already at page 1', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goFirst()

      expect(onChange).toHaveBeenCalledWith(1)
    })
  })

  describe('goLast', () => {
    it('calls onChangeCurrentPage with totalPages', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 5,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goLast()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(10)
    })

    it('still calls onChangeCurrentPage(totalPages) when already at the last page', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 10,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goLast()

      expect(onChange).toHaveBeenCalledWith(10)
    })

    it('clamps to 1 when totalPages is 0', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 5,
          totalPages: 0,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.goLast()

      expect(onChange).toHaveBeenCalledWith(1)
    })
  })

  it('navigation actions do not throw when onChangeCurrentPage is not provided', () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 1, totalPages: 10 }),
    )

    expect(() => {
      result.current.goNext()
      result.current.goPrevious()
      result.current.goFirst()
      result.current.goLast()
    }).not.toThrow()
  })

  // ── E — setCurrentPage Clamping ───────────────────────

  describe('setCurrentPage', () => {
    it('calls onChangeCurrentPage with the given page number within range', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.setCurrentPage(5)

      expect(onChange).toHaveBeenCalledWith(5)
    })

    it('clamps to 1 when pageNumber is 0', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.setCurrentPage(0)

      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('clamps to 1 when pageNumber is negative', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.setCurrentPage(-100)

      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('clamps to totalPages when pageNumber exceeds total', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.setCurrentPage(999)

      expect(onChange).toHaveBeenCalledWith(10)
    })

    it('passes through pageNumber 1 (lower boundary)', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 5,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.setCurrentPage(1)

      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('passes through pageNumber equal to totalPages (upper boundary)', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({
          currentPage: 5,
          totalPages: 10,
          onChangeCurrentPage: onChange,
        }),
      )

      result.current.setCurrentPage(10)

      expect(onChange).toHaveBeenCalledWith(10)
    })
  })

  // ── F — currentPage Return Value ──────────────────────

  it('returns currentPage as-is (pass-through, not clamped)', () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 7, totalPages: 10 }),
    )

    expect(result.current.currentPage).toBe(7)
  })

  it('returns currentPage even when value is 0 (pass-through)', () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 0, totalPages: 10 }),
    )

    expect(result.current.currentPage).toBe(0)
  })

  // ── G — Token Delegation ──────────────────────────────

  it('tokens equal computePaginationTokens output for same input', () => {
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 5,
        totalPages: 20,
        siblings: 1,
        boundaries: 1,
      }),
    )

    const expected = computePaginationTokens({
      totalPages: 20,
      currentPage: 5,
      siblings: 1,
      boundaries: 1,
    })

    expect(result.current.tokens).toEqual(expected)
  })

  it('returns empty tokens when totalPages is 0', () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 1, totalPages: 0 }),
    )

    expect(result.current.tokens).toEqual([])
  })

  // ── H — Memoization ───────────────────────────────────

  describe('memoization', () => {
    it('tokens reference is stable when deps do not change', () => {
      const { result, rerender } = renderHook(
        ({ currentPage, totalPages, siblings, boundaries }) =>
          usePagination({ currentPage, totalPages, siblings, boundaries }),
        {
          initialProps: {
            currentPage: 5,
            totalPages: 20,
            siblings: 1,
            boundaries: 1,
          },
        },
      )

      const firstRef = result.current.tokens

      rerender({ currentPage: 5, totalPages: 20, siblings: 1, boundaries: 1 })

      expect(result.current.tokens).toBe(firstRef)
    })

    it('tokens reference is stable across multiple rerenders with same deps', () => {
      const { result, rerender } = renderHook(
        ({ currentPage, totalPages, siblings, boundaries }) =>
          usePagination({ currentPage, totalPages, siblings, boundaries }),
        {
          initialProps: {
            currentPage: 5,
            totalPages: 20,
            siblings: 1,
            boundaries: 1,
          },
        },
      )

      const firstRef = result.current.tokens

      rerender({ currentPage: 5, totalPages: 20, siblings: 1, boundaries: 1 })
      rerender({ currentPage: 5, totalPages: 20, siblings: 1, boundaries: 1 })
      rerender({ currentPage: 5, totalPages: 20, siblings: 1, boundaries: 1 })

      expect(result.current.tokens).toBe(firstRef)
    })

    it('tokens reference is stable when onChangeCurrentPage changes (not a dep)', () => {
      const fnA = vi.fn()
      const fnB = vi.fn()

      const { result, rerender } = renderHook(
        ({
          currentPage,
          totalPages,
          siblings,
          boundaries,
          onChangeCurrentPage,
        }) =>
          usePagination({
            currentPage,
            totalPages,
            siblings,
            boundaries,
            onChangeCurrentPage,
          }),
        {
          initialProps: {
            currentPage: 5,
            totalPages: 20,
            siblings: 1,
            boundaries: 1,
            onChangeCurrentPage: fnA,
          },
        },
      )

      const firstRef = result.current.tokens

      rerender({
        currentPage: 5,
        totalPages: 20,
        siblings: 1,
        boundaries: 1,
        onChangeCurrentPage: fnB,
      })

      expect(result.current.tokens).toBe(firstRef)
    })

    it('tokens recompute when currentPage changes', () => {
      const { result, rerender } = renderHook(
        ({ currentPage, totalPages, siblings, boundaries }) =>
          usePagination({ currentPage, totalPages, siblings, boundaries }),
        {
          initialProps: {
            currentPage: 5,
            totalPages: 20,
            siblings: 1,
            boundaries: 1,
          },
        },
      )

      const firstRef = result.current.tokens

      rerender({ currentPage: 6, totalPages: 20, siblings: 1, boundaries: 1 })

      expect(result.current.tokens).not.toBe(firstRef)
    })

    it('tokens recompute when totalPages changes', () => {
      const { result, rerender } = renderHook(
        ({ currentPage, totalPages, siblings, boundaries }) =>
          usePagination({ currentPage, totalPages, siblings, boundaries }),
        {
          initialProps: {
            currentPage: 5,
            totalPages: 20,
            siblings: 1,
            boundaries: 1,
          },
        },
      )

      const firstRef = result.current.tokens

      rerender({ currentPage: 5, totalPages: 30, siblings: 1, boundaries: 1 })

      expect(result.current.tokens).not.toBe(firstRef)
    })

    it('tokens recompute when siblings changes', () => {
      const { result, rerender } = renderHook(
        ({ currentPage, totalPages, siblings, boundaries }) =>
          usePagination({ currentPage, totalPages, siblings, boundaries }),
        {
          initialProps: {
            currentPage: 5,
            totalPages: 20,
            siblings: 1,
            boundaries: 1,
          },
        },
      )

      const firstRef = result.current.tokens

      rerender({ currentPage: 5, totalPages: 20, siblings: 2, boundaries: 1 })

      expect(result.current.tokens).not.toBe(firstRef)
    })

    it('tokens recompute when boundaries changes', () => {
      const { result, rerender } = renderHook(
        ({ currentPage, totalPages, siblings, boundaries }) =>
          usePagination({ currentPage, totalPages, siblings, boundaries }),
        {
          initialProps: {
            currentPage: 5,
            totalPages: 20,
            siblings: 1,
            boundaries: 1,
          },
        },
      )

      const firstRef = result.current.tokens

      rerender({ currentPage: 5, totalPages: 20, siblings: 1, boundaries: 2 })

      expect(result.current.tokens).not.toBe(firstRef)
    })
  })

  // ── I — Edge Cases ────────────────────────────────────

  it('totalPages 0 does not crash navigation actions', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: 0,
        onChangeCurrentPage: onChange,
      }),
    )

    expect(() => {
      result.current.goNext()
      result.current.goPrevious()
      result.current.goFirst()
      result.current.goLast()
      result.current.setCurrentPage(3)
    }).not.toThrow()
  })

  it('handles siblings=0 and boundaries=0 without crashing', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 5,
        totalPages: 10,
        siblings: 0,
        boundaries: 0,
        onChangeCurrentPage: onChange,
      }),
    )

    expect(Array.isArray(result.current.tokens)).toBe(true)
    expect(result.current.tokens.length).toBeGreaterThan(0)

    result.current.goNext()
    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('passes through float currentPage without truncation', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 5.7,
        totalPages: 10,
        onChangeCurrentPage: onChange,
      }),
    )

    expect(result.current.currentPage).toBe(5.7)

    result.current.goNext()
    expect(onChange).toHaveBeenCalledWith(6.7)
  })

  it('handles siblings larger than totalPages without crashing', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 3,
        totalPages: 5,
        siblings: 100,
        onChangeCurrentPage: onChange,
      }),
    )

    expect(result.current.tokens).toEqual([1, 2, 3, 4, 5])

    result.current.goNext()
    expect(onChange).toHaveBeenCalledWith(4)
  })
})
