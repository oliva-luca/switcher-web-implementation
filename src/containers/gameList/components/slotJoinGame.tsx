import { useState } from 'react';
import Swal from 'sweetalert2';

import './slotJoinGame.css'
import axios from 'axios';


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

function fullGameButtonColor(e){
    e.target.style.background = '#9b9b9b';
}


async function joinGame(id: number) {

    const gameData = {
        player_name: 'jugador'
    };
    const queryString = new URLSearchParams(gameData as any).toString();
    try {
        const response = await axios.put(`/gamelist/${id}?${queryString}`);
        console.log('Game joined successfully:', response.data);
    } catch (error) {
        console.error('Error joining game:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al unirse al juego. Por favor, inténtalo de nuevo.',
        });
    }
}

export function SlotJoinGame({ id, name, currentCapacity, capacity }: GameProps){

    let full;
    if (currentCapacity == capacity){
        full = true;
    }
    else{
        full = false;
    }
    
    return (
        <article id='slotPartida'>

            <span id='idPartida'>ID: {id}</span>
            
            <span id='nombrePartida'>{name}</span>
            
            <aside id='capacidadPartida'>{currentCapacity}/{capacity}</aside> 
            
            <button id='botonUnirse'
                    onMouseOver={full ? undefined : changeBackground}
                    onMouseLeave={full ? undefined : restoreBackground}
                    onClick={full ? undefined : () => joinGame(id)}
                    style={{ background: full ? '#9b9b9b' : '#7eb65b', cursor: full ? 'not-allowed' : 'pointer' }}
                    disabled={full}
                    >{full ? 'Lleno' : 'Unirse'}</button>
        </article>
    )
}