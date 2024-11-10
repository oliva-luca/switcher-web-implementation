import React, { useEffect, useState } from "react";
import "./QuitBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Importar Axios
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const QuitBtn = () => {
  const navigate = useNavigate();
  const quit = () => {
    const userId = sessionStorage.getItem("playerId");
    try {
      const response = axios.put(`/gamelist/leave/${userId}`);
      console.log(response);
      navigate("/lobby");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type="submit"
      className="btn btn-lg w-20 bottom-quit"
      onClick={quit}
    >
      ABANDONAR PARTIDA
    </button>
  );
};

export default QuitBtn;
