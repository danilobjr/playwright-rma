import { type ComponentProps } from 'react'
import { Slot } from 'radix-ui'

import type { AsChildProp } from '@/components/shared/types/as-child-prop.type'
import { cn } from '@/utils/styles/cn.util'

import { buttonVariants, type ButtonVariants } from './button.styles'

type ButtonProps = ComponentProps<'button'> & ButtonVariants & AsChildProp

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
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

export type { ButtonProps }

export { Button }
