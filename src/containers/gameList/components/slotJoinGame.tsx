import { useState } from 'react';
import './slotJoinGame.css'
// import 'bootstrap/dist/css/bootstrap-grid.css'

export interface GameProps {
    id: number;
    name: string;
    currentCapacity: number;
    capacity: number;
  }

function changeBackground(e) {
    e.target.style.background = '#6ec5e1';
}

function restoreBackground(e) {
    e.target.style.background = '#7eb65b';
}

export function SlotJoinGame({ id, name, currentCapacity, capacity }: GameProps){

    return (
        <article id='slotPartida'>

            <span id='idPartida'>ID: {id}</span>
            
            <span id='nombrePartida'>{name}</span>
            
            <aside id='capacidadPartida'>{currentCapacity}/{capacity}</aside> 
            
            <button id='botonUnirse'    onMouseOver={changeBackground}
                                        onMouseLeave={restoreBackground}>
                                        Unirse</button>
        </article>
    )
}
