import React, { useState, useEffect } from "react";
import "./CantPlayer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Importar Axios

const CantPlayer = () => {
  const [variable1, setVariable1] = useState(0);
  const [variable2, setVariable2] = useState(0);

  useEffect(() => {
    const fetchGameData = async () => {
      const gameId = sessionStorage.getItem("gameId");
      try {
        const response = await axios.get(`/gamelist/${gameId}`);
        // Actualiza las variables con los datos obtenidos
        setVariable1(response.data.players.length);
        setVariable2(response.data.cant_jugadores);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, []);

  return (
    <div className="top-left-text">
      JUGADORES {variable1}/{variable2}
    </div>
  );
};

export default CantPlayer;
