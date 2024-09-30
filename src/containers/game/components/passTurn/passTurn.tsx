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

    useEffect(() => {
        // --------------------------
        const fetchGameData = async () => {
            try {
                const response = await axios.get(`/gamelist/1`);
                setGameData(response.data);
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchGameData();
    }, [1]);

    const userId = localStorage.getItem("userId");

    return (
        <div className="pass-turn">
            <Button
                variant="primary"
                disabled={!gameData || gameData.turn !== Number(localStorage.getItem('userId'))}
                className={!gameData || gameData.turn === Number(localStorage.getItem('userId')) ? 'blue-button' : 'gray-button'}
                onClick={async () => {
                    try{
                        const response = await axios.put(`/end_turn/1`);
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