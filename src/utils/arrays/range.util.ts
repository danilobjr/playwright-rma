/**
 * Generates an array containing a sequence of numbers.
 *
 * @param length - The number of elements in the array.
 * @param start - The starting number of the sequence (default is 0).
 * @returns An array of numbers in the specified range.
 *
 * @example
 * range(5) // [0, 1, 2, 3, 4]
 * range(5, 11) // [11, 12, 13, 14, 15]
 */
function range(length: number, start = 0) {
  return Array.from({ length }, (_, index) => index + start)
}

export { range }
