export const tw =
  (strings: string, ...values: unknown[]) =>
  () => {
    return String.raw({ raw: strings }, ...values)
  }
