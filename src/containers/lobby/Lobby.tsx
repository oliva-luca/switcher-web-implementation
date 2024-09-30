import './Lobby.css'
import CreateGame from './createGame/components/createGame'
import GameList from './gameList/gameList'
import React, { useEffect, useState } from 'react';

export function Lobby() {
  const [isConnected, setIsConnected] = useState(false);
  const [gameListKey, setGameListKey] = useState(0);

  useEffect(() => {
    const socket = new WebSocket('localhost:8000/ws');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    };

    socket.onmessage = () => {
      console.log('WebSocket message received');
      setGameListKey(prevKey => prevKey + 1); // Update key to force re-render
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
      setIsConnected(false);
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="container">

      <div className='d-flex flex-column align-items-center'>
      <h2 className='title'>Unirse a partida</h2>
      {isConnected ? <p>Connected</p> : <p>Not Connected</p>}
      <GameList key={gameListKey} /> {/* Render GameList with a unique key */}
      </div>

      <div className='d-flex flex-column align-items-center'>
      <h2 className='title'>Crear partida</h2>
      <CreateGame />
      </div>

    </div>
  );
}

export default Lobby;
