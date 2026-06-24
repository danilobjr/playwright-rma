import { purry } from '@/utils/function/purry.util'

type Limits = {
  min?: number
  max?: number
}

/**
 * Clamps a number within the inclusive min/max range.
 *
 * **Data-first** version of `clamp`.
 *
 * @param value - The number to clamp
 * @param limits - An object containing optional `min` and/or `max` properties. See {@link Limits}
 * @returns The clamped number
 * @signature
 * ```
 *   clamp(value, { min?, max? });
 * ```
 * @example
 *   clamp(5, { min: 1, max: 10 }) // returns 5
 *   clamp(-3, { min: 0 }) // returns 0
 *   clamp(15, { max: 10 }) // returns 10
 * @dataFirst
 */
function clamp(value: number, limits: Limits): number

/**
 * Clamps a number within the inclusive min/max range.
 *
 * **Data-last** version of `clamp`.
 *
 * @param value - The number to clamp
 * @param limits - An object containing optional `min` and/or `max` properties
 * @returns The clamped number
 * @signature
 * ```
 *   clamp(value, { min?, max? });
 * ```
 * @example
 *   clamp({ min: 1, max: 10 })(5) // returns 5
 *   clamp({ min: 0 })(-3) // returns 0
 *   clamp({ max: 10 })(15) // returns 10
 * @dataLast
 */
function clamp(limits: Limits): (value: number) => number

function clamp(...args: unknown[]): unknown {
  return purry(clampImplementation, args)
}

function clampImplementation(value: number, { min, max }: Limits): number {
  return min !== undefined && value < min
    ? min
    : max !== undefined && value > max
      ? max
      : value
}

export { clamp }
