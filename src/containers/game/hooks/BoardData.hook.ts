import { useEffect, useState } from "react";
import axios from "axios";
import { BoardData } from "../utils/interfaces";

/**
 * Hook para obtener datos del tablero de una partida especifica dede la API
 *
 * Este hook maneja el estado del tablero ("board") dentro de una partida
 * a partir de la informacion proporcionada por el servidor cuando el
 * componente hace la request.
 *
 * @returns {Object} Datos del tablero y la funciona para actualizarlo.
 */
export const useBoard = () => {
  // Variable de estado para guardar los datos del tablero
  const [board, setBoard] = useState<BoardData | null>(null);

  useEffect(() => {
    // Obtiene el ID de la partida desde sessionStorage
    const gameId = sessionStorage.getItem("gameId");

    // HTTP request del tablero a partir del gameId
    axios
      .get(`/tableros/${gameId}`)
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => {
        // Muestra un error si la solicitud falla
        console.error("Error fetching the game list:", error);
      });
  }, []);

  // Retorna los datos del tablero y la funcion para modificarlos
  return { board, setBoard };
};
