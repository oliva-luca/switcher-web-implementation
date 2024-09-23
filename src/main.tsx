import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Lobby from './containers/lobby/Lobby.tsx'; // Importa el componente Lobby
import Game from './containers/game/Game.tsx'; // Importa el componente Game
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <div className='app'>
        <Routes>
          {/* <Route path="/lobby" element={<Lobby />} /> */}
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  </StrictMode>,
);