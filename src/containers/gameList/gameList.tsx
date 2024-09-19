import './gameList.css'
import { SlotJoinGame } from './components/slotJoinGame'

export function GameList() {

    return (

    <div id="gameColumn">
    {SlotJoinGame('Partida 1', 2, 2)}
    {SlotJoinGame('Partida 2', 4, 2)}
    {SlotJoinGame('Partida 3', 4, 4)}
    {SlotJoinGame('Partida 4', 3, 2)}
    </div>

    )

  }