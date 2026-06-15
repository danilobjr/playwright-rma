import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './query-client.config'
import { RouterConfig } from './router.config'

export function RootConfig() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterConfig />
      </QueryClientProvider>
    </StrictMode>
  )
}
