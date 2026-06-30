import { tw } from '@/utils/styles/tw.util'

export const root = tw(`
  flex
  w-full
  items-center
  gap-4
`)

export const pageSelector = {
  list: tw(`
    flex
    flex-row
    items-center
    gap-1
  `),
}

export const dots = tw(`
  flex
  size-8
  items-center
  justify-center
`)

export const button = tw(`
  font-medium
  data-[active=true]:cursor-default
  data-[active=true]:border-none
  data-[active=true]:bg-primary/5
  data-[active=true]:text-primary
`)

export const buttonWithText = {
  root: tw(`
    group/button-with-text
    data-[has-text=true]:gap-1
    data-[has-text=true]:px-2.5
    data-[has-text=true]:data-[children-position=icon-left]:sm:pe-4
    data-[has-text=true]:data-[children-position=icon-right]:sm:ps-4
  `),
  iconSlot: tw(`
    group-data-[has-text=true]/button-with-text:group-data-[children-position=icon-right]/button-with-text:order-2
  `),
}

export const ellipsis = tw(`
  flex
  size-9
  items-center
  justify-center
`)

export const rowCount = {
  root: tw(`
    text-[0.8125rem]
    text-nowrap
  `),
  words: {
    base: tw(`
      text-muted-foreground
    `),
    first: tw(`
      hidden
      text-muted-foreground
      sm:inline
    `),
  },
}

export const pageSizeSelector = {
  root: tw(`
    w-fit
    bg-card
    whitespace-nowrap
  `),
  displayText: tw(`
    -mb-px
    hidden
    text-[0.8125rem]
    text-muted-foreground
    sm:inline
  `),
}

export const separator = tw(`
  data-[orientation=vertical]:h-4
  data-[orientation=vertical]:self-auto
`)
