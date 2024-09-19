import './slotJoinGame.css'

export function SlotJoinGame(nombre: string, capacidad: number, capacidadActual: number){
    return (
        <article id='slotPartida'>
            <span id='nombrePartida'>{nombre}</span>
            <aside id='capacidadPartida'>{capacidadActual}/{capacidad}</aside> 
            <button id='botonUnirse'>Unirse</button>
        </article>
    )
}
