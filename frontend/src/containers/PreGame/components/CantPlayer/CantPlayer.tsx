import React, { useState, useEffect } from "react";
import "./CantPlayer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

/**
 * El componente CantPlayer muestra la cantidad de jugadores conectados a un juego.
 * 
 * Este componente obtiene los datos del juego para determinar la cantidad de jugadores conectados
 * y la cantidad de jugadores permitidos. Muestra la cantidad de jugadores conectados y la cantidad
 * de jugadores permitidos en la parte superior de la pantalla. También muestra una lista de los
 * nombres de los jugadores conectados.
 * 
 * @returns {JSX.Element} La cantidad de jugadores conectados y la lista de nombres de los jugadores conectados.
 */

const CantPlayer = () => {
  const [variable1, setVariable1] = useState(0);
  const [variable2, setVariable2] = useState(0);
  const [nombres, setNombres] = useState<string[]>([]);

  // Obtiene los datos del juego para determinar la cantidad de jugadores conectados
  useEffect(() => {
    const fetchGameData = async () => {
      const gameId = sessionStorage.getItem("gameId");
      try {
        const response = await axios.get(`/gamelist/${gameId}`);
        console.log("Game data:", response.data);
        // Actualiza las variables con los datos obtenidos
        setVariable1(response.data.players.length);
        setVariable2(response.data.cant_jugadores);
        setNombres(response.data.players.map((player: { nombre: string }) => player.nombre));
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, []);

  // Muestra la cantidad de jugadores conectados y la lista de nombres de los jugadores conectados
  return (
    <div className="mid-center-text">
      CONECTADOS {variable1}/{variable2}
      <br />
      <ul>
        {/* mapea los nombres de jugadores para mostrarlos como una lista */}
        {nombres.map((nombre, index) => (
          <li key={index}>{nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default CantPlayer;
