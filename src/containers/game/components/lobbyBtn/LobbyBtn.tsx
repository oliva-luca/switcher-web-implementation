import React, { useEffect, useState } from "react";
import "./LobbyBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LobbyBtn = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    sessionStorage.clear();
    navigate("/lobby");
  };

  return (
    <button
      type="submit"
      className="btn btn-lg buttom-lobby"
      onClick={handleClick}
    >
      VOLVER AL LOBBY
    </button>
  );
};

export default LobbyBtn;
