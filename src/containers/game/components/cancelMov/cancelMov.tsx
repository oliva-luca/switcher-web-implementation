import React, { useEffect, useState } from "react";
import "./cancelMov.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Importar Axios
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";

const CancelMov = () => {
  const { currentTurn } = useCurrentPlay();
  const cancel = async () => {
    const gameId = sessionStorage.getItem("gameId");
    if (currentTurn == sessionStorage.getItem("playerId")) {
      try {
        await axios.put(`/gamelist/cancelmoves/${gameId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <button
      type="submit"
      className="btn btn-lg w-20 bottom-cancel"
      onClick={cancel}
    >
      CANCELAR MOVIMIENTOS
    </button>
  );
};

export default CancelMov;
