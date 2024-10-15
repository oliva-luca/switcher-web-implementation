import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SlotJoinGame from './components/slotJoinGame';
import { useFilter } from '../filters/FilterContext'; // Ajusta la ruta según sea necesario
import './gameList.css';

export default function GameList() {
  const [partidas, setPartidas] = useState([]);
  const { playerCount, nameFilter } = useFilter(); // Accede a los valores del contexto

  useEffect(() => {
    axios.get('/gamelist')
      .then(response => {
        setPartidas(response.data);
        // console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching the game list:', error);
      });
  }, []);

  const filteredPartidas = partidas
    .filter(partida => !partida.started)
    .filter(partida => {
      if (playerCount) {
        return partida.cant_jugadores === Number(playerCount);
      }
      return true;
    })
    .filter(partida => {
      if (nameFilter) {
        return partida.name.toLowerCase().includes(nameFilter.toLowerCase());
      }
      return true;
    });

  return (
    <div id="gameColumn">
      {filteredPartidas.map((partida) => (
        <SlotJoinGame
          key={partida.id_partida}
          id={partida.id_partida}
          name={partida.name}
          currentCapacity={partida.players.length}
          capacity={partida.cant_jugadores}
          is_private={partida.is_private}
          password={partida.password}
        />
      ))}
    </div>
  );
}