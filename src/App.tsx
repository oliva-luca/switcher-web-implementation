import React, { useEffect, useState } from 'react';
import { GameList } from './containers/gameList/gameList'; // Assuming GameList is a component in the same directory

const App: React.FC = () => {
  const [gameListKey, setGameListKey] = useState(0);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = () => {
      console.log('WebSocket message received');
      setGameListKey(prevKey => prevKey + 1); // Update key to force re-render
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Switcher</h1>
      <GameList key={gameListKey} /> {/* Render GameList with a unique key */}
    </div>
  );
};

export default App;