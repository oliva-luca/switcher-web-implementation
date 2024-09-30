import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './containers/lobby/Lobby.tsx';
import PreGame from './containers/PreGame/PreGame.tsx';
import Home from './containers/home/Home.tsx';
import Game from './containers/game/Game.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      {/* <div className='app'> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/pregame" element={<PreGame />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      {/* </div> */}
    </Router>
  </StrictMode>
);
