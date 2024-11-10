import React, { useEffect, useState } from "react";
import "./CancelBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Importar Axios
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CancelBtn: React.FC = () => {
  const navigate = useNavigate();
  const [idOwner, setIdOwner] = useState(null);
  const userId = sessionStorage.getItem("playerId");

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

  const cancel = async () => {
    try {
      const response = await axios.put(`/gamelist/leave_lobby/${userId}`);
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
