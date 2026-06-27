import { type ComponentProps } from 'react'

import { cn } from '@/utils/styles/cn.util'

import {
  alertActionStyles,
  alertDescriptionStyles,
  alertTitleStyles,
  alertVariants,
  type AlertVariants,
} from './alert.styles'

type AlertProps = ComponentProps<'div'> & AlertVariants

function Alert({
  children = null,
  className = '',
  variant,
  ...otherProps
}: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...otherProps}
    >
      {children}
    </div>
  )
}

type AlertTitleProps = ComponentProps<'div'>

function AlertTitle({
  children = null,
  className = '',
  ...otherProps
}: AlertTitleProps) {
  return (
    <div
      className={cn(alertTitleStyles, className)}
      data-slot="alert-title"
      {...otherProps}
    >
      {children}
    </div>
  )
}

type AlertDescriptionProps = ComponentProps<'div'>

function AlertDescription({
  children = null,
  className = '',
  ...otherProps
}: AlertDescriptionProps) {
  return (
    <div
      className={cn(alertDescriptionStyles, className)}
      data-slot="alert-description"
      {...otherProps}
    >
      {children}
    </div>
  )
}

type AlertActionProps = ComponentProps<'div'>

function AlertAction({
  children = null,
  className = '',
  ...otherProps
}: AlertActionProps) {
  return (
    <div
      className={cn(alertActionStyles, className)}
      data-slot="alert-action"
      {...otherProps}
    >
      {children}
    </div>
  )
}

export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionProps,
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
