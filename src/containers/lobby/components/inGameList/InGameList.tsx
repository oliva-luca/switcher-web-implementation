/**
 * @file InGameList.tsx
 * @description Este componente muestra una lista de partidas en las que el usuario puede unirse.
 *
 * @module InGameList
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import SlotJoinStartedGame from "./slotJoinStartedGame";
import "./inGameList.css";

/**
 * @interface UserData
 * @description Interfaz que define la estructura de los datos del usuario.
 * @property {Number} id_user - Identificador del usuario.
 * @property {String} nombre - Nombre del usuario.
 * @property {Array<PlayerData>} players - Lista de jugadores asociados al usuario.
 */

/**
 * @interface PlayerData
 * @description Interfaz que define la estructura de los datos del jugador.
 * @property {string} nombre - Nombre del jugador.
 * @property {boolean} in_game - Indica si el jugador está en una partida.
 * @property {number | null} position - Posición del jugador en la partida.
 * @property {number} id_partida - Identificador de la partida.
 * @property {number} id_jugador - Identificador del jugador.
 * @property {boolean} block - Indica si el jugador está bloqueado.
 * @property {number} user_id - Identificador del usuario al que pertenece el jugador.
 */

/**
 * @function InGameList
 * @description Componente funcional que muestra una lista de partidas en las que el usuario puede unirse.
 *
 * @returns {JSX.Element} Retorna un elemento JSX que contiene la lista de partidas.
 *
 * @example
 * <InGameList />
 *
 * @remarks
 * Este componente utiliza dos hooks useEffect para realizar peticiones a la API y obtener los datos del usuario y la lista de partidas.
 * Filtra las partidas en las que el usuario ya está unido y muestra las restantes utilizando el componente SlotJoinStartedGame.
 */

interface UserData {
  id_user: Number;
  nombre: String;
  players: Array<PlayerData>;
}

interface PlayerData {
  nombre: string;
  in_game: boolean;
  position: number | null;
  id_partida: number;
  id_jugador: number;
  block: boolean;
  user_id: number;
}

export default function InGameList() {
  const [userData, setUserData] = useState<Array<UserData>>([]);
  const [partidas, setPartidas] = useState([]);

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

  useEffect(() => {
    axios
      .get("/gamelist")
      .then((response) => {
        setPartidas(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  const joinedGames = userData
    .find((user) => user.id_user.toString() == localStorage.getItem("userId"))
    ?.players.filter((partida) => partida.id_partida != null);

  const filteredPartidas = partidas.filter(
    (partida) => !joinedGames?.includes(partida.id_partida)
  );

  return (
    <div id="startedGamesColumn">
      {filteredPartidas.map((partida) => (
        <SlotJoinStartedGame
          key={partida.id_partida}
          id={partida.id_partida}
          name={partida.name}
          currentCapacity={partida.players.length}
          capacity={partida.cant_jugadores}
          started={partida.started}
          playerId={
            userData
              .find(
                (user) =>
                  user.id_user.toString() == localStorage.getItem("userId")
              )
              ?.players.find((ply) => ply.id_partida == partida.id_partida)
              ?.id_jugador ?? 0
          }
        />
      ))}
    </div>
  );
}
