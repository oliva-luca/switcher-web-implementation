import './gameList.css'
import { SlotJoinGame } from './components/slotJoinGame'

const partidas = [
  { id: 1, name: 'Partida 1', currentCapacity: 2, capacity: 2 },
  { id: 2, name: 'Partida 2', currentCapacity: 2, capacity: 4 },
  { id: 3, name: 'Partida 3', currentCapacity: 4, capacity: 4 },
  { id: 4, name: 'Partida 4', currentCapacity: 2, capacity: 3 },
  { id: 5, name: 'Partida 5', currentCapacity: 2, capacity: 3 },
  { id: 6, name: 'Partida 6', currentCapacity: 2, capacity: 3 },
  { id: 7, name: 'Partida 7', currentCapacity: 2, capacity: 3 },
  { id: 8, name: 'Partida 8', currentCapacity: 2, capacity: 3 },
];



export default function GameList() {

  return (
    <div id="gameColumn">
      {partidas.map((partida) => (
        <SlotJoinGame
          id={partida.id}
          name={partida.name}
          currentCapacity={partida.currentCapacity}
          capacity={partida.capacity}
        />
      ))}
    </div>
  );
}