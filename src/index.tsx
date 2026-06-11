import { createRoot } from 'react-dom/client'

import '@/styles/index.css'

import { RootConfig } from './config/root.config'

createRoot(document.getElementById('root')!).render(<RootConfig />)
