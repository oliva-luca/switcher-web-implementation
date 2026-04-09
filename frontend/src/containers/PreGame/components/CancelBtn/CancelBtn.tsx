import React, { useEffect, useState } from "react";
import "./CancelBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";

/**
 * El componente CancelBtn es un botón que permite al propietario de un juego cancelar el juego.
 * 
 * Este componente obtiene los datos del juego para determinar el propietario del juego y 
 * lo compara con el ID del usuario actual almacenado en el almacenamiento de sesión. Si el 
 * usuario actual es el propietario, muestra un botón que permite al propietario cancelar el juego.
 * 
 * La función cancel envía una solicitud al servidor para salir del lobby y navega al usuario 
 * de vuelta a la página del lobby. Si ocurre un error durante este proceso, se muestra un 
 * mensaje de error utilizando SweetAlert2.
 * 
 * @returns {JSX.Element | null} Un botón para cancelar el juego si el usuario es el propietario, de lo contrario null.
 */
import { useNavigate } from "react-router-dom";

const CancelBtn: React.FC = () => {
  const navigate = useNavigate();
  const [idOwner, setIdOwner] = useState(null);
  const userId = sessionStorage.getItem("playerId");

  // Obtiene los datos del juego para determinar el propietario del juego
  useEffect(() => {
    const fetchGameData = async () => {
      const gameId = sessionStorage.getItem("gameId");
      if (!gameId) {
        console.error("Game ID not found");
        return;
      }

      try {
        const response = await axios.get(`/gamelist/${gameId}`);
        // console.log('Game:', response.data);
        setIdOwner(response.data.owner); // Actualiza el estado con el ID del propietario
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  });

  // Cancela el juego y navega al usuario de vuelta a la página del lobby
  const cancel = async () => {
    try {
      await axios.put(`/gamelist/leave_lobby/${userId}`);
      // console.log('Game started successfully:', response.data);
      navigate("/lobby");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cancelar la partida",
      });
    }
  };

  // Muestra el botón de cancelar si el usuario es el propietario
  if (idOwner == userId) {
    return (
      <button
        type="submit"
        className="btn btn-lg w-20 bottom-left-button-cancel"
        onClick={cancel}
      >
        CANCELAR PARTIDA
      </button>
    );
  } else {
    return null;
  }
};

export default CancelBtn;
