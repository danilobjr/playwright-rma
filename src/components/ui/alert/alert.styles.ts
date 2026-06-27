import { cva, type VariantProps } from 'cva'

import { tw } from '@/utils/styles/tw.util'

const alertVariants = cva(
  `
    group/alert
    relative
    grid
    w-full
    gap-0.5
    rounded-lg
    border
    px-2.5
    py-2
    text-left
    text-sm
    has-data-[slot=alert-action]:relative
    has-data-[slot=alert-action]:pr-18
    has-[>svg]:grid-cols-[auto_1fr]
    has-[>svg]:gap-x-2
    *:[svg]:row-span-2
    *:[svg]:translate-y-0.5
    *:[svg]:text-current
    *:[svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        default: `
          bg-card
          text-card-foreground
        `,
        destructive: `
          bg-card
          text-destructive
          *:data-[slot=alert-description]:text-destructive/90
          *:[svg]:text-current
        `,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const alertTitleStyles = tw(`
  font-medium
  group-has-[>svg]/alert:col-start-2
  [&_a]:underline
  [&_a]:underline-offset-3
  [&_a]:hover:text-foreground
`)

const alertDescriptionStyles = tw(`
  text-sm
  text-balance
  text-muted-foreground
  md:text-pretty
  [&_a]:underline
  [&_a]:underline-offset-3
  [&_a]:hover:text-foreground
  [&_p:not(:last-child)]:mb-4
`)

const alertActionStyles = tw(`
  absolute
  top-2
  right-2
`)

type AlertVariants = VariantProps<typeof alertVariants>

export type { AlertVariants }

export {
  alertVariants,
  alertTitleStyles,
  alertDescriptionStyles,
  alertActionStyles,
}
