import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GameBoard from './containers/gameBoard/GameBoard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <button className="btn btn-primary">holas</button>
    <GameBoard />
  </StrictMode>,
)
