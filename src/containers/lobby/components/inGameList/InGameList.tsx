import React, { useEffect, useState } from "react";
import axios from "axios";
import SlotJoinStartedGame from "./slotJoinStartedGame";
import "./inGameList.css";

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

  const filteredPartidas = partidas
  .filter((partida) => !joinedGames?.includes(partida.id_partida));

  return (
    <div id = "startedGamesColumn">
      {filteredPartidas.map((partida) => (
        <SlotJoinStartedGame
          key={partida.id_partida}
          id={partida.id_partida}
          name={partida.name}
          currentCapacity={partida.players.length}
          capacity={partida.cant_jugadores}
          started={partida.started}
          playerId={userData.find((user) => user.id_user.toString() == localStorage.getItem("userId"))?.players.find((ply) => ply.id_partida == partida.id_partida)?.id_jugador ?? 0}
        />
      ))}
    </div>
  );
}
