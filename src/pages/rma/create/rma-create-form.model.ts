import { z } from 'zod'

const PRODUCT_ID_PREFIX = 'PRD-'

function sanitizeProductIdSuffix(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
}

const rmaCreateFormSchema = z.object({
  customerName: z.string().trim().min(1, 'Customer name is required'),
  productId: z
    .string()
    .transform(sanitizeProductIdSuffix)
    .pipe(
      z
        .string()
        .min(1, 'Product ID is required')
        .regex(/^[A-Z0-9]{4}$/, 'Product ID must match PRD-XXXX'),
    )
    .transform((suffix) => `${PRODUCT_ID_PREFIX}${suffix}`),
  reason: z
    .string()
    .trim()
    .min(1, 'Reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(255, 'Reason must be at most 255 characters'),
})

type RmaCreateFormInput = z.input<typeof rmaCreateFormSchema>
type RmaCreateFormValues = z.output<typeof rmaCreateFormSchema>

const rmaCreateFormDefaultValues: RmaCreateFormInput = {
  customerName: '',
  productId: '',
  reason: '',
}

export type { RmaCreateFormInput, RmaCreateFormValues }

export {
  PRODUCT_ID_PREFIX,
  rmaCreateFormDefaultValues,
  rmaCreateFormSchema,
  sanitizeProductIdSuffix,
}
