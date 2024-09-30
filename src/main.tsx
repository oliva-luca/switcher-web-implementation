<<<<<<< HEAD
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './containers/lobby/Lobby.tsx';
import PreGame from './containers/PreGame/PreGame.tsx';
import Home from './containers/home/Home.tsx';
import Game from './containers/game/Game.tsx';
import './index.css';
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Lobby from "./containers/lobby/Lobby.tsx";
import Game from "./containers/game/Game.tsx";
import Home from "./containers/home/Home.tsx";
import "./index.css";
>>>>>>> eaf7b827183de3336ab21cf9e513358fab473059

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      {/* <div className='app'> */}
<<<<<<< HEAD
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/pregame" element={<PreGame />} />
          <Route path="/game" element={<Game />} />
        </Routes>
=======
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
      </Routes>
>>>>>>> eaf7b827183de3336ab21cf9e513358fab473059
      {/* </div> */}
    </Router>
  </StrictMode>
);
