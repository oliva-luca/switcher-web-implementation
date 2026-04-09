import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { GameData } from "../utils/interfaces";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

/**
 * Hook para obtener datos de la partida
 *
 * Este hook maneja el estado de la partida ("game") y consultar la
 * información del juego desde un servidor HTTP. Proporciona el estado
 * actual del juego, actualiza cuando se reciben nuevos mensajes y
 * redirige al usuario si se detecta un evento de "ganador".
 *
 * @returns {Object}
 * - `game` (GameData | null): Objeto con informacion de la partida.
 * - `gameInfoKey` (number): Clave para actualizar componentes dependientes del `game`
 */
export const useGame = () => {
  // Variable de estado para guardar los datos de la partida
  const [game, setGame] = useState<GameData | null>(null);

  // Variable de estado para guardar la gamekey
  const [gameInfoKey, setGameInfoKey] = useState(0);
  // Hook para redirigir a otra ruta
  const navigate = useNavigate();

  useEffect(() => {
    // Obtiene el ID de la partida desde sessionStorage
    const gameId = sessionStorage.getItem("gameId");

    // Establece una conexión WebSocket al servidor
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

    // Funcion del GET request del tablero a partir del gameId
    const getData = async () => {
      await axios
        .get(`/gamelist/${gameId}`)
        .then((response) => {
          setGame(response.data);
        })
        .catch((error) => {
          console.error("Error fetching the game list:", error);
        });
    };

    // Evento de apertura del WebSocket
    socket.onopen = () => {
      getData();
    };

    // Evento para mensajes recibidos a través del WebSocket
    socket.onmessage = (event) => {
      // Incrementa GameInfoKey para actualizar componentes dependientes
      setGameInfoKey((prevKey) => prevKey + 1);

      // Procesa mensaje recibido
      const message = event.data;

      // Verifica si el usuario actual es el ganador y muestra una alerta
      if (message.includes("winner")) {
        const winner = message.replace("winner ", "");
        if (winner == sessionStorage.getItem("playerId"))
          Swal.fire({
            title: "¡Ganaste!",
            text: "Felicidades, has ganado la partida.",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        if(winner != sessionStorage.getItem("playerId"))
          Swal.fire({
            title: "¡Perdiste!",
            text: "Lo siento, has perdido la partida.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        // Limpia la sesión y redirige al lobby
        sessionStorage.clear();
        navigate("/lobby");
      } else {
        // Si no hay ganador, obtiene nuevamente los datos del juego
        getData();
      }
    };

    // Evento cuando el WebSocket se cierra
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Evento de error del WebSocket
    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    // Limpia el WebSocket al desmontar el componente
    return () => {
      socket.close();
    };
  }, []);

  // Retorna la información del juego y la clave para actualizar dependencias
  return { game, gameInfoKey };
};
