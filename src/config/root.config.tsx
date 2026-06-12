import { StrictMode } from 'react'

import { RouterConfig } from './router.config'

export function RootConfig() {
  return (
    <StrictMode>
      <RouterConfig />
    </StrictMode>
  )
}
