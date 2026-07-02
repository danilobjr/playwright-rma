import type { ComponentProps, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'

import { AppSelect, type AppSelectProps } from '@/components/app/app-select.app'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/styles/cn.util'

import * as styles from './pagination.styles'

type PaginationProps = ComponentProps<'div'>
function Pagination({
  className = '',
  children,
  ...otherProps
}: PaginationProps) {
  return (
    <div
      className={cn(styles.root(), className)}
      data-slot="pagination"
      aria-label="Pagination"
      {...otherProps}
    >
      {children}
    </div>
  )
}

type PaginationPageSelectorProps = ComponentProps<'nav'> & {
  classNameList?: string
}
function PaginationPageSelector({
  children = null,
  classNameList = '',
  ...otherProps
}: PaginationPageSelectorProps) {
  return (
    <nav
      data-slot="pagination-page-selector"
      aria-label="Page selector"
      role="navigation"
      {...otherProps}
    >
      <ul className={cn(styles.pageSelector.list(), classNameList)}>
        {children}
      </ul>
    </nav>
  )
}

type PaginationItemProps = ComponentProps<'li'>
function PaginationItem(props: PaginationItemProps) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationButtonProps = ButtonProps & {
  active?: boolean
}
function PaginationButton({
  className = '',
  active,
  size = 'icon-sm',
  ...otherProps
}: PaginationButtonProps) {
  return (
    <Button
      className={cn(styles.button(), className)}
      data-active={active}
      aria-current={active ? 'page' : undefined}
      size={size}
      variant={active ? 'outline' : 'ghost'}
      {...otherProps}
    />
  )
}

type PaginationDotsProps = ComponentProps<'div'>
function PaginationDots({
  className = '',
  ...otherProps
}: PaginationDotsProps) {
  return (
    <div
      className={cn(styles.dots(), className)}
      data-slot="pagination-dots"
      {...otherProps}
    >
      <MoreHorizontalIcon />
    </div>
  )
}

type PaginationButtonWithTextProps = Omit<PaginationButtonProps, 'children'> & {
  icon: ReactNode
  childrenPosition?: 'icon-left' | 'icon-right'
  text?: string
}
function PaginationButtonWithText({
  className = '',
  childrenPosition = 'icon-left',
  icon,
  text = '',
  ...otherProps
}: PaginationButtonWithTextProps) {
  return (
    <PaginationButton
      className={cn(styles.buttonWithText.root(), className)}
      data-has-text={!!text}
      data-children-position={childrenPosition}
      size={text ? 'sm' : 'icon-sm'}
      {...otherProps}
    >
      <Slot className={cn(styles.buttonWithText.iconSlot())}>{icon}</Slot>
      {text}
    </PaginationButton>
  )
}

type PaginationButtonFirstProps = Omit<
  PaginationButtonWithTextProps,
  'icon' | 'childrenPosition'
>
function PaginationButtonFirst(props: PaginationButtonFirstProps) {
  return (
    <PaginationButtonWithText
      icon={<ChevronFirstIcon />}
      aria-label="Go to first page"
      {...props}
    />
  )
}

type PaginationButtonLastProps = Omit<
  PaginationButtonWithTextProps,
  'icon' | 'childrenPosition'
>
function PaginationButtonLast(props: PaginationButtonLastProps) {
  return (
    <PaginationButtonWithText
      childrenPosition="icon-right"
      icon={<ChevronLastIcon />}
      aria-label="Go to last page"
      {...props}
    />
  )
}

type PaginationButtonPreviousProps = Omit<
  PaginationButtonWithTextProps,
  'icon' | 'childrenPosition'
>
function PaginationButtonPrevious(props: PaginationButtonPreviousProps) {
  return (
    <PaginationButtonWithText
      icon={<ChevronLeftIcon />}
      aria-label="Go to previous page"
      {...props}
    />
  )
}

type PaginationButtonNextProps = Omit<
  PaginationButtonWithTextProps,
  'icon' | 'childrenPosition'
>
function PaginationButtonNext(props: PaginationButtonNextProps) {
  return (
    <PaginationButtonWithText
      childrenPosition="icon-right"
      icon={<ChevronRightIcon />}
      aria-label="Go to next page"
      {...props}
    />
  )
}

type PaginationEllipsisProps = ComponentProps<'span'>
function PaginationEllipsis({
  className = '',
  ...otherProps
}: PaginationEllipsisProps) {
  return (
    <span
      className={cn(styles.ellipsis(), className)}
      data-slot="pagination-ellipsis"
      aria-hidden
      {...otherProps}
    >
      <MoreHorizontalIcon size={16} />
      <span className="sr-only">More pages</span>
    </span>
  )
}

type PaginationItemCountProps = ComponentProps<'div'> & {
  firstRowNumberOnCurrentPage: string | number
  lastRowNumberOnCurrentPage: string | number
  totalRows: number
}
function PaginationItemCount({
  className = '',
  firstRowNumberOnCurrentPage,
  lastRowNumberOnCurrentPage,
  totalRows,
  ...otherProps
}: PaginationItemCountProps) {
  return (
    <div
      className={cn(styles.itemCount.root(), className)}
      data-slot="pagination-item-count"
      {...otherProps}
    >
      <span
        className={cn(
          styles.itemCount.words.base(),
          styles.itemCount.words.first(),
        )}
      >
        Showing
      </span>{' '}
      {firstRowNumberOnCurrentPage}-{lastRowNumberOnCurrentPage}{' '}
      <span className={styles.itemCount.words.base()}>of</span> {totalRows}{' '}
      <span className={styles.itemCount.words.base()}>items</span>
    </div>
  )
}

// FIXME ui component shouldn't depend on App component. Convert AppSelect component on InputSelect? Check Gip project
type PaginationPageSizeSelectorProps = AppSelectProps
function PaginationPageSizeSelector({
  className = '',
  value = '',
  ...otherProps
}: PaginationPageSizeSelectorProps) {
  return (
    <AppSelect
      className={cn(styles.pageSizeSelector.root(), className)}
      size="xs"
      value={value}
      renderDisplay={(v) => (
        <span className="flex items-end gap-1">
          <span>{v}</span>
          <span className={styles.pageSizeSelector.displayText()}>
            per page
          </span>
        </span>
      )}
      {...otherProps}
    />
  )
}

type PaginationSeparatorProps = ComponentProps<typeof Separator>
function PaginationSeparator({
  className = '',
  ...otherProps
}: PaginationSeparatorProps) {
  return (
    <Separator
      className={cn(styles.separator(), className)}
      orientation="vertical"
      {...otherProps}
    />
  )
}

export type {
  PaginationProps,
  PaginationPageSelectorProps,
  PaginationItemProps,
  PaginationDotsProps,
  PaginationButtonProps,
  PaginationButtonFirstProps,
  PaginationButtonLastProps,
  PaginationButtonPreviousProps,
  PaginationButtonNextProps,
  PaginationEllipsisProps,
  PaginationItemCountProps,
  PaginationPageSizeSelectorProps,
  PaginationSeparatorProps,
}

export {
  Pagination,
  PaginationPageSelector,
  PaginationItem,
  PaginationDots,
  PaginationButton,
  PaginationButtonFirst,
  PaginationButtonLast,
  PaginationButtonPrevious,
  PaginationButtonNext,
  PaginationEllipsis,
  PaginationItemCount,
  PaginationPageSizeSelector,
  PaginationSeparator,
}
