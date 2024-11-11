/**
 * @file gameList.tsx
 * @description Este archivo contiene el componente GameList que muestra una lista de partidas disponibles para unirse.
 *
 * @module GameList
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import SlotJoinGame from "./components/slotJoinGame";
import { useFilter } from "../filters/FilterContext"; // Ajusta la ruta según sea necesario
import "./gameList.css";

/**
 * Componente GameList
 *
 * Este componente se encarga de mostrar una lista de partidas disponibles para que los usuarios se unan.
 * Filtra las partidas según los filtros proporcionados por el contexto de filtros y excluye las partidas
 * a las que el usuario ya se ha unido.
 *
 * @component
 * @returns {JSX.Element} Un elemento JSX que representa la lista de partidas.
 */

export default function GameList() {
  const [partidas, setPartidas] = useState([]);
  const { playerCount, nameFilter } = useFilter(); // Accede a los valores del contexto
  const [userData, setUserData] = useState([]);

  /**
   * useEffect para obtener la lista de partidas desde el servidor.
   * Se ejecuta una vez al montar el componente.
   */
  useEffect(() => {
    axios
      .get("/gamelist")
      .then((response) => {
        setPartidas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  /**
   * useEffect para obtener los datos del usuario desde el servidor.
   * Se ejecuta una vez al montar el componente.
   */
  useEffect(() => {
    axios
      .get("/user")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  /**
   * Obtiene las partidas a las que el usuario ya se ha unido.
   *
   * @constant {Array<number>} joinedGames - Lista de IDs de partidas a las que el usuario ya se ha unido.
   */

  const joinedGames =
    userData
      .find(
        (user) => user.id_user.toString() === localStorage.getItem("userId")
      )
      ?.players.map((ply) => ply.id_partida) || [];

  /**
   * Filtra las partidas según los filtros de contexto y excluye las partidas a las que el usuario ya se ha unido.
   *
   * @constant {Array<Object>} filteredPartidas - Lista de partidas filtradas.
   */

  const filteredPartidas = partidas
    .filter((partida) => !partida.started)
    .filter((partida) => {
      if (playerCount) {
        return partida.cant_jugadores === Number(playerCount);
      }
      return true;
    })
    .filter((partida) => {
      if (nameFilter) {
        return partida.name.toLowerCase().includes(nameFilter.toLowerCase());
      }
      return true;
    })
    .filter((partida) => !joinedGames.includes(partida.id_partida));

  return (
    <div id="gameColumn">
      {filteredPartidas.map((partida) => (
        <SlotJoinGame
          key={partida.id_partida}
          id={partida.id_partida}
          name={partida.name}
          currentCapacity={partida.players.length}
          capacity={partida.cant_jugadores}
          is_private={partida.is_private}
          password={partida.password}
        />
      ))}
    </div>
  );
}
