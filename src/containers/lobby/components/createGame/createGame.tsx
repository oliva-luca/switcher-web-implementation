/**
 * @fileoverview Componente para crear un nuevo juego en la aplicación.
 * @module CreateGame
 */

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./createGame.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/**
 * Interfaz para la respuesta de la creación de un juego.
 * @interface GameResponse
 */
interface GameResponse {
  id: string;
  name: string;
  status: string;
}

/**
 * Componente para crear un nuevo juego.
 * @component
 * @returns {JSX.Element} JSX Elemento del componente CreateGame.
 */

const CreateGame = () => {
  const [name, setName] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [players, setPlayers] = useState<number>(4);
  const navigate = useNavigate();

  /**
   * Maneja el cambio en el campo de nombre del juego.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio del input.
   */
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  /**
   * Maneja el cambio en el checkbox de partida privada.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio del input.
   */
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  /**
   * Maneja el cambio en el campo de contraseña.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio del input.
   */
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  /**
   * Maneja el cambio en el campo de cantidad de jugadores.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio del input.
   */
  const handlePlayersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value < 2) {
      setPlayers(2);
    } else if (value > 4) {
      setPlayers(4);
    } else {
      setPlayers(value);
    }
  };

  /**
   * Maneja el envío del formulario para crear un nuevo juego.
   * @param {React.FormEvent<HTMLFormElement>} event - Evento de envío del formulario.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const gameData = {
      name: name,
      cant_players: players,
      priv: isPrivate,
      psw: password,
    };

    const queryString = new URLSearchParams(gameData as any).toString();
    let createInfo: GameResponse = { id: "-1", name: "", status: "" };

    try {
      const response = await axios.post(`/gamelist?${queryString}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      createInfo = response.data;
      console.log("Game created successfully:", createInfo);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "Hubo un problema al crear la partida",
      });
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      console.log("Joining game");
      const joinData = {
        user_id: userId,
      };

      const joinQueryString = new URLSearchParams(joinData as any).toString();
      const response = await axios
        .put(`/gamelist/join/${createInfo.id}?${joinQueryString}`, null, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          sessionStorage.setItem("playerId", response.data.id_player);
          console.log(`Player id:${response.data.id_player}`);
          console.log("Game joined successfully:", response.data);
          sessionStorage.setItem("gameId", createInfo.id);
          navigate("/pregame");
        });
    } catch (error) {
      await axios.delete(`/gamelist/${createInfo.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "Hubo un problema al unirse a la partida",
      });
      return;
    }
  };

  return (
    <div className="container custom-container">
      <div className="row justify-content-center d-flex">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 row align-items-center block-background">
              <label
                htmlFor="name"
                className="col-sm-4 col-form-label text-end"
              >
                NOMBRE:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={name}
                  onChange={handleNameChange}
                  maxLength={16}
                  required
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center block-background">
              <label
                htmlFor="type"
                className="col-sm-4 col-form-label text-end"
              >
                PARTIDA PRIVADA:
              </label>
              <div className="col-sm-8 d-flex align-items-center">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input custom-switch"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckCheckedDisabled"
                    checked={isPrivate}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3 row align-items-center block-background">
              <label
                htmlFor="password"
                className="col-sm-4 col-form-label text-end"
              >
                CONTRASEÑA:
              </label>
              <div className="col-sm-8">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={!isPrivate}
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center block-background">
              <label
                htmlFor="players"
                className="col-sm-4 col-form-label text-end"
              >
                CANTIDAD DE JUGADORES:
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  id="players"
                  name="players"
                  className="form-control"
                  value={players}
                  onChange={handlePlayersChange}
                  min="2"
                  max="4"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn custom-button btn-lg w-100">
              Crear
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
