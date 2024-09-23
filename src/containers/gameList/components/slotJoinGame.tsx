import { useState } from 'react';
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
    }
}

export function SlotJoinGame({ id, name, currentCapacity, capacity }: GameProps){

    return (
        <article id='slotPartida'>

            <span id='idPartida'>ID: {id}</span>
            
            <span id='nombrePartida'>{name}</span>
            
            <aside id='capacidadPartida'>{currentCapacity}/{capacity}</aside> 
            
            <button id='botonUnirse'
                    onMouseOver={changeBackground}
                    onMouseLeave={restoreBackground}
                    onClick={() => joinGame(id)}
                    >Unirse</button>
        </article>
    )
}