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
function Pagination({ className = '', ...otherProps }: PaginationProps) {
  return (
    <div
      className={cn(styles.root(), className)}
      data-slot="pagination"
      aria-label="pagination"
      {...otherProps}
    />
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
      aria-label="page selector"
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
      aria-label="go to first page"
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
      aria-label="go to last page"
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
      aria-label="go to previous page"
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
      aria-label="go to next page"
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

type PaginationRowCountProps = ComponentProps<'div'> & {
  firstRowNumberOnCurrentPage: string | number
  lastRowNumberOnCurrentPage: string | number
  totalRows: number
}
function PaginationRowCount({
  className = '',
  firstRowNumberOnCurrentPage,
  lastRowNumberOnCurrentPage,
  totalRows,
  ...otherProps
}: PaginationRowCountProps) {
  return (
    <div
      className={cn(styles.rowCount.root(), className)}
      data-slot="pagination-row-count"
      {...otherProps}
    >
      {firstRowNumberOnCurrentPage}-{lastRowNumberOnCurrentPage}{' '}
      <span className={styles.rowCount.words.of()}>of</span> {totalRows}{' '}
      <span className={styles.rowCount.words.items()}>
        {totalRows !== 1 ? 'pages' : 'page'}
      </span>
    </div>
  )
}

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
  PaginationRowCount,
  PaginationPageSizeSelector,
  PaginationSeparator,
  type PaginationProps,
  type PaginationPageSelectorProps,
  type PaginationItemProps,
  type PaginationDotsProps,
  type PaginationButtonProps,
  type PaginationButtonFirstProps,
  type PaginationButtonLastProps,
  type PaginationButtonPreviousProps,
  type PaginationButtonNextProps,
  type PaginationEllipsisProps,
  type PaginationRowCountProps,
  type PaginationPageSizeSelectorProps,
  type PaginationSeparatorProps,
}
