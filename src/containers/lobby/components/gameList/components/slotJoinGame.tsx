import React from 'react';
import Swal from 'sweetalert2';
import './slotJoinGame.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export interface GameProps {
    id: number;
    name: string;
    currentCapacity: number;
    capacity: number;
    is_private: boolean;
    password: string;
  }

function changeBackground(e) {
    e.target.style.background = '#6ec5e1';
}

function restoreBackground(e) {
    e.target.style.background = '#7eb65b';
}

export default function SlotJoinGame({ id, name, currentCapacity, capacity, is_private, password }: GameProps){
    const navigate = useNavigate();


    const joinGame = async (id) => {
        try {
            if (is_private) {
                const result = await Swal.fire({
                    title: 'Ingrese la contraseña',
                    input: 'password',
                    confirmButtonText: 'Unirse',
                    confirmButtonColor: '#7eb65b',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: '#d33',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Debes ingresar una contraseña';
                        }
                    }
                });

                if (!result.isConfirmed || result.value !== password) {
                    if (result.isConfirmed) {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Contraseña incorrecta',
                            text: 'Por favor, intenta de nuevo.',
                        });
                    }
                    return;
                }
            }

            const userId = localStorage.getItem('userId');
            //console.log('Joining game');
            const joinData = {
                player_id: userId,
            };

            const joinQueryString = new URLSearchParams(joinData as any).toString();
            await axios.put(`/gamelist/join/${id}?${joinQueryString}`, null, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            localStorage.setItem('gameId', id.toString());
            navigate('/pregame');
        } catch (error) {
            // console.error('Error joining game:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al unirse al juego. Por favor, inténtalo de nuevo.',
            });
        }
    };

    let full;
    if (currentCapacity >= capacity){
        full = true;
    }
    else{
        full = false;
    }
    
    return (
        <article id='slotPartida'>
            <span id='idPartida'>ID: {id}</span>
            <span id='nombrePartida'>{name}</span>
            {is_private && (
                <span id='candadoPartida'>
                    <FontAwesomeIcon icon={faLock} />
                </span>
            )}
            <aside id='capacidadPartida'>{currentCapacity}/{capacity}</aside>
            <button id='botonUnirse'
                    onMouseOver={full ? undefined : changeBackground}
                    onMouseLeave={full ? undefined : restoreBackground}
                    onClick={full ? undefined : () => joinGame(id)}
                    style={{ background: full ? '#9b9b9b' : '#7eb65b', cursor: full ? 'not-allowed' : 'pointer' }}
                    disabled={full}>
                {full ? 'Lleno' : 'Unirse'}
            </button>
        </article>
    );
}