import React from 'react';
import './passTurn.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';


import { useEffect, useState } from 'react';
interface GameData {
    turn: number;
    // Add other properties of gameData if needed
}


const PassTurn = () => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [nameTurn, setNameTurn] = useState(null);

    useEffect(() => {
        // --------------------------
        const fetchGameData = async () => {
            try {
                const gameId = localStorage.getItem("gameId");
                const response = await axios.get(`/gamelist/${gameId}`);
                setGameData(response.data);
                if (response.data.turn !== undefined) {
                    const toFind = response.data.turn;
                    const response2 = await axios.get(`/user/${toFind}`);
                    setNameTurn(response2.data.nombre);
                    console.log(response2.data.nombre);
                } else{
                    console.log("PPE");
                }
        } catch (error) {
            console.error('Error fetching game data:', error);
        }
        };

        fetchGameData();
    }, [1]);

    return (
        <div className="pass-turn">
            <div className="top-right-text">
            TURNO DE: {nameTurn ? nameTurn : 'Loading...'}
            </div>
            <Button
                variant="primary"
                disabled={!gameData || gameData.turn !== Number(localStorage.getItem('userId'))}
                className={!gameData || gameData.turn === Number(localStorage.getItem('userId')) ? 'blue-button' : 'gray-button'}
                onClick={async () => {
                    try{
                        const gameId = localStorage.getItem("gameId")
                        const response = await axios.put(`/end_turn/${gameId}`);
                    }
                    catch(error){
                        console.error('Error ending turn:', error);
                    }
                }}
            >
                pass turn
            </Button>
            {/* {gameData && (
                <div>
                    <h3>Game Data:</h3>
                    <pre>{JSON.stringify(gameData, null, 2)}</pre>
                </div>
            )} */}
        </div>
    );
};

export default PassTurn;