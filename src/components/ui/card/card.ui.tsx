import { type ComponentProps } from 'react'

import { cn } from '@/utils/styles/cn.util'

import {
  cardActionVariants,
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardVariants,
  type CardVariants,
} from './card.styles'

type CardProps = ComponentProps<'div'> & CardVariants

type CardHeaderProps = ComponentProps<'div'>

type CardTitleProps = ComponentProps<'div'>

type CardDescriptionProps = ComponentProps<'div'>

type CardActionProps = ComponentProps<'div'>

type CardContentProps = ComponentProps<'div'>

type CardFooterProps = ComponentProps<'div'>

function Card({ className = '', size = 'default', ...otherProps }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ size }), className)}
      data-slot="card"
      data-size={size}
      {...otherProps}
    />
  )
}

function CardHeader({ className = '', ...otherProps }: CardHeaderProps) {
  return (
    <div
      className={cn(cardHeaderVariants(), className)}
      data-slot="card-header"
      {...otherProps}
    />
  )
}

function CardTitle({ className = '', ...otherProps }: CardTitleProps) {
  return (
    <div
      className={cn(cardTitleVariants(), className)}
      data-slot="card-title"
      {...otherProps}
    />
  )
}

function CardDescription({
  className = '',
  ...otherProps
}: CardDescriptionProps) {
  return (
    <div
      className={cn(cardDescriptionVariants(), className)}
      data-slot="card-description"
      {...otherProps}
    />
  )
}

function CardAction({ className = '', ...otherProps }: CardActionProps) {
  return (
    <div
      className={cn(cardActionVariants(), className)}
      data-slot="card-action"
      {...otherProps}
    />
  )
}

function CardContent({ className = '', ...otherProps }: CardContentProps) {
  return (
    <div
      className={cn(cardContentVariants(), className)}
      data-slot="card-content"
      {...otherProps}
    />
  )
}

function CardFooter({ className = '', ...otherProps }: CardFooterProps) {
  return (
    <div
      className={cn(cardFooterVariants(), className)}
      data-slot="card-footer"
      {...otherProps}
    />
  )
}

export type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
}
