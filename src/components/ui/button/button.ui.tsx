import { type ComponentProps } from 'react'
import { Slot } from 'radix-ui'

import type { AsChildProp } from '@/components/shared/types/as-child-prop.type'
import { cn } from '@/utils/styles/cn.util'

import { buttonVariants, type ButtonVariants } from './button.styles'

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ComponentProps<'button'> & ButtonVariants & AsChildProp) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
