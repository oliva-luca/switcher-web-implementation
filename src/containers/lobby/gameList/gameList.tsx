import './gameList.css'
import SlotJoinGame from './components/slotJoinGame'
import axios from 'axios';
import { useEffect, useState } from 'react';


export default function GameList() {
  
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
    axios.get('/gamelist')
      .then(response => {
        setPartidas(response.data);
      })
      .catch(error => {
        console.error('Error fetching the game list:', error);
      });
  }, []);

  return (
    <div id="gameColumn">
      {partidas.map((partida) => (
        <SlotJoinGame
          id={partida.id_partida}
          name={partida.name}
          currentCapacity={partida.players.length}
          capacity={partida.cant_jugadores}
        />
      ))}
    </div>
  );
}