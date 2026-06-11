import { StrictMode } from 'react'

import { RouterConfig } from './router.config'

// TODO providers and friends on this file

export function RootConfig() {
  return (
    <StrictMode>
      <RouterConfig />
    </StrictMode>
  )
}
