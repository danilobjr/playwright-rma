import { type ComponentProps } from 'react'

import { cn } from '@/utils/styles/cn.util'

type TableProps = ComponentProps<'table'>
type TableHeaderProps = ComponentProps<'thead'>
type TableBodyProps = ComponentProps<'tbody'>
type TableFooterProps = ComponentProps<'tfoot'>
type TableRowProps = ComponentProps<'tr'>
type TableHeadProps = ComponentProps<'th'>
type TableCellProps = ComponentProps<'td'>
type TableCaptionProps = ComponentProps<'caption'>

function Table({ className, ...otherProps }: TableProps) {
  return (
    <div
      className="relative w-full overflow-x-auto"
      data-slot="table-container"
    >
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        data-slot="table"
        {...otherProps}
      />
    </div>
  )
}

function TableHeader({ className, ...otherProps }: TableHeaderProps) {
  return (
    <thead
      className={cn('[&_tr]:border-b', className)}
      data-slot="table-header"
      {...otherProps}
    />
  )
}

function TableBody({ className, ...otherProps }: TableBodyProps) {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0', className)}
      data-slot="table-body"
      {...otherProps}
    />
  )
}

function TableFooter({ className, ...otherProps }: TableFooterProps) {
  return (
    <tfoot
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      data-slot="table-footer"
      {...otherProps}
    />
  )
}

function TableRow({ className, ...otherProps }: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      data-slot="table-row"
      {...otherProps}
    />
  )
}

function TableHead({ className, ...otherProps }: TableHeadProps) {
  return (
    <th
      className={cn(
        'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0',
        className,
      )}
      data-slot="table-head"
      {...otherProps}
    />
  )
}

function TableCell({ className, ...otherProps }: TableCellProps) {
  return (
    <td
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0',
        className,
      )}
      data-slot="table-cell"
      {...otherProps}
    />
  )
}

function TableCaption({ className, ...otherProps }: TableCaptionProps) {
  return (
    <caption
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      data-slot="table-caption"
      {...otherProps}
    />
  )
}

export type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeadProps,
  TableHeaderProps,
  TableProps,
  TableRowProps,
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
