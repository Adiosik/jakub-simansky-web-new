import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import SimanskyHero from './SimanskyHero.tsx'
import { theme } from './theme.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <SimanskyHero />
    </ThemeProvider>
  </StrictMode>,
)
