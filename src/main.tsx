import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GameBoard from './containers/gameBoard/GameBoard.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameBoard />
  </StrictMode>,
)
