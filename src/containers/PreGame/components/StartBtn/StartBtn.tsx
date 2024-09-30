import React, { useState } from 'react';
import './StartBtn.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Importar Axios
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const StartBtn = () => {
    const [started, setStarted] = useState(false);
    const navigate = useNavigate();

    const start = async () => {
        const gameId = localStorage.getItem('gameId');
        console.log('Game ID:', gameId);
        if (!gameId) {
            console.error('Game ID not found');
            return;
        }

        try {
            const response = await axios.put(`/gamelist/start/${gameId}`, {
            headers: {
                'Content-Type': 'application/json',
            }
            });
            setStarted(true);
            console.log('Game started successfully:', response.data);
            navigate('/game');
        } catch (error) {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Se necesitan más jugadores para comenzar',
                });
            }
    }


    return (
        <button 
            type="submit" 
            className="btn btn-lg w-20 bottom-right-button" 
            onClick={start}>
            INICIAR PARTIDA
        </button>
    );
    
}

export default StartBtn;