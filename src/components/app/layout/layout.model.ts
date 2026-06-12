import type { ReactNode } from 'react'

type LayoutConfig = {
  breadcrumbs: string[]
  title: string
  description: string
  topRightAction?: ReactNode
}

export type { LayoutConfig }
