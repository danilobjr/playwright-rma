import { z } from 'zod'

const rmaCreateFormSchema = z.object({
  customerName: z.string().trim().min(1, 'Customer Name is required'),
  productId: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(
      z
        .string()
        .min(1, 'Product ID is required')
        .regex(/^PRD-[A-Z0-9]{4}$/, 'Product ID must match PRD-XXXX'),
    ),
  reason: z.string().trim().min(1, 'Reason is required'),
})

type RmaCreateFormInput = z.input<typeof rmaCreateFormSchema>
type RmaCreateFormValues = z.output<typeof rmaCreateFormSchema>

const rmaCreateFormDefaultValues: RmaCreateFormInput = {
  customerName: '',
  productId: '',
  reason: '',
}

export type { RmaCreateFormInput, RmaCreateFormValues }

export { rmaCreateFormDefaultValues, rmaCreateFormSchema }
