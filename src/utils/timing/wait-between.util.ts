const DEFAULT_MIN_WAIT_MS = 1_000
const DEFAULT_MAX_WAIT_MS = 2_000

type WaitBetweenOptions = {
  maxMs?: number
  minMs?: number
  random?: () => number
}

function getRandomWaitMs(minMs: number, maxMs: number, random: () => number) {
  return Math.round(minMs + (maxMs - minMs) * random())
}

function waitBetween({
  maxMs = DEFAULT_MAX_WAIT_MS,
  minMs = DEFAULT_MIN_WAIT_MS,
  random = Math.random,
}: WaitBetweenOptions = {}) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, getRandomWaitMs(minMs, maxMs, random))
  })
}

export { DEFAULT_MAX_WAIT_MS, DEFAULT_MIN_WAIT_MS, waitBetween }
