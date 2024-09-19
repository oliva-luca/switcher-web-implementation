import './gameList.css'
import { SlotJoinGame } from './components/slotJoinGame'

const partidas = [
  { id: 1, nombre: 'Partida 1', capacidadActual: 2, capacidad: 2 },
  { id: 2, nombre: 'Partida 2', capacidadActual: 2, capacidad: 4 },
  { id: 3, nombre: 'Partida 3', capacidadActual: 4, capacidad: 4 },
  { id: 4, nombre: 'Partida 4', capacidadActual: 2, capacidad: 3 },
];



export function GameList() {

  return (
    <div id="gameColumn">
      {partidas.map((partida) => (
        <SlotJoinGame
          id={partida.id}
          nombre={partida.nombre}
          capacidadActual={partida.capacidadActual}
          capacidad={partida.capacidad}
        />
      ))}
    </div>
  );
}