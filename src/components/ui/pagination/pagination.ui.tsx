import { type ComponentProps } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/styles/cn.util'

type PaginationProps = ComponentProps<'nav'>
type PaginationContentProps = ComponentProps<'ul'>
type PaginationItemProps = ComponentProps<'li'>
type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ComponentProps<typeof Button>, 'size'> &
  ComponentProps<'a'>
type PaginationPreviousProps = PaginationLinkProps & {
  text?: string
}
type PaginationNextProps = PaginationLinkProps & {
  text?: string
}
type PaginationEllipsisProps = ComponentProps<'span'>

function Pagination({ className, ...otherProps }: PaginationProps) {
  return (
    <nav
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      data-slot="pagination"
      role="navigation"
      {...otherProps}
    />
  )
}

function PaginationContent({
  className,
  ...otherProps
}: PaginationContentProps) {
  return (
    <ul
      className={cn('flex items-center gap-0.5', className)}
      data-slot="pagination-content"
      {...otherProps}
    />
  )
}

function PaginationItem(otherProps: PaginationItemProps) {
  return <li data-slot="pagination-item" {...otherProps} />
}

function PaginationLink({
  children,
  className,
  isActive = false,
  size = 'icon',
  ...otherProps
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      className={cn(className)}
      size={size}
      variant={isActive ? 'outline' : 'ghost'}
    >
      <a
        aria-current={isActive ? 'page' : undefined}
        data-active={isActive}
        data-slot="pagination-link"
        {...otherProps}
      >
        {children}
      </a>
    </Button>
  )
}

function PaginationPrevious({
  children,
  className,
  text = 'Previous',
  ...otherProps
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn('pl-1.5!', className)}
      size="default"
      {...otherProps}
    >
      {children ?? (
        <>
          <ChevronLeftIcon data-icon="inline-start" />
          <span className="hidden sm:block">{text}</span>
        </>
      )}
    </PaginationLink>
  )
}

function PaginationNext({
  children,
  className,
  text = 'Next',
  ...otherProps
}: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn('pr-1.5!', className)}
      size="default"
      {...otherProps}
    >
      {children ?? (
        <>
          <span className="hidden sm:block">{text}</span>
          <ChevronRightIcon data-icon="inline-end" />
        </>
      )}
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...otherProps
}: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="pagination-ellipsis"
      {...otherProps}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
