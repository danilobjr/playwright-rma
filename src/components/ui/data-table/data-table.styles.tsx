import { tw } from '@/utils/styles/tw.util'

const root = tw(`
  overflow-visible
  text-sm
`)

const emptyTableCell = tw(`
  h-24
  text-center
`)

const link = tw(`
  inline-block
`)

const pagination = tw(`
  flex
  items-center
`)

export { root, emptyTableCell, link, pagination }
