import "./PreGame.css"
// import PreGameBoard from './components/GameBoard/PreGameBoard'
import StartBtn from "./components/StartBtn/StartBtn";
import CantPlayer from "./components/CantPlayer/CantPlayer";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PreGame() {
    const navigate = useNavigate();

    // const board: string[][] = [
    //     ["red", "ylw", "grn", "blu", "red", "ylw", "grn"],
    //     ["blu", "red", "ylw", "grn", "blu", "red", "ylw"],
    //     ["grn", "blu", "red", "ylw", "grn", "blu", "red"],
    //     ["ylw", "grn", "blu", "red", "ylw", "grn", "blu"],
    //     ["red", "ylw", "grn", "blu", "red", "ylw", "grn"],
    //     ["blu", "red", "ylw", "grn", "blu", "red", "ylw"],
    // ];
    const [gameInfoKey, setGameInfoKey] = useState(0);
    useEffect(() => {
        let gameId = localStorage.getItem('gameId');
        console.log("GAME ID: ", gameId);
        const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);
    
        socket.onopen = () => {
          console.log('WebSocket connection established');
        };
    
        socket.onmessage = (event) => {
          console.log('WebSocket message received');
          setGameInfoKey(prevKey => prevKey + 1); // Update key to force re-render
          const message = event.data;
            switch (message) {
                case 'Game has started':
                    // alert("La partida empezo");
                    navigate('/game')
                    break;
                default:
                    // alert("Actualizar info partida");
                    console.log(message)
                    break;
            }
        };
    
        socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
    
        socket.onerror = (error) => {
          console.error('WebSocket error: ', error);
        };
    
        // Cleanup on component unmount
        return () => {
          socket.close();
        };
      }, []);

    return(
        <>
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="top-left-text" style={{zIndex: 3}}>
                <CantPlayer key={gameInfoKey}/>
            </div>
            <div className="blank-screen"></div>
            {/* <div className="content" style={{ zIndex: 1 }}>
                <PreGameBoard board={board}/>
            </div> */}
            <div style={{zIndex: 3}}>
                <StartBtn />
            </div>
        </div>
            </>
    )
}

export default PreGame