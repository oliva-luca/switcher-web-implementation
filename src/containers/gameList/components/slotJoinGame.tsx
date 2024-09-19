import './slotJoinGame.css'
// import 'bootstrap/dist/css/bootstrap-grid.css'

export interface GameProps {
    id: number;
    nombre: string;
    capacidadActual: number;
    capacidad: number;
  }

export function SlotJoinGame({ id, nombre, capacidadActual, capacidad }: GameProps){
    return (
        <article id='slotPartida'>
            <span id='idPartida'>ID: {id}</span>
            <span id='nombrePartida'>{nombre}</span>
            <aside id='capacidadPartida'>{capacidadActual}/{capacidad}</aside> 
            <button id='botonUnirse'>Unirse</button>
        </article>
    )
}
