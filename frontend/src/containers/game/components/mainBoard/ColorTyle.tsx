import React from "react";
import "./ColorTyle.css";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";
import axios from "axios";

// Interfaz de propiedades del componente
interface ColorTyleProps {
  tyleId: number;
  col: number;
  row: number;
  color: string;
  blocked: boolean;
  tipo_figura: number;
}

// Mapa de movimientos posibles según el tipo de carta de movimiento
const movMap = new Map<number, [number, number]>();
movMap.set(1, [2, 2]);
movMap.set(2, [2, 0]);
movMap.set(3, [1, 0]);
movMap.set(4, [1, 1]);
movMap.set(5, [2, 1]);
movMap.set(6, [1, 2]);
movMap.set(7, [4, 0]);

/**
 * Valida si un movimiento es posible en función del tipo de carta y la posición
 * actual y seleccionada en el tablero.
 *
 * @param {}:
 * - `cardType` (number): Tipo de carta de movimiento.
 * - `col` (number): Columna de la ficha objetivo.
 * - `row` (number): Fila de la ficha objetivo.
 * - `selectedCol` (number): Columna de la ficha seleccionada.
 * - `selectedRow` (number): Fila de la ficha seleccionada.
 *
 * @returns {boolean} `true` si el movimiento es posible; de lo contrario, `false`.
 */
const availableMov = (
  cardType: number,
  col: number,
  row: number,
  selectedCol: number,
  selectedRow: number
) => {
  const baseMov = movMap.get(cardType);
  return baseMov == undefined
    ? false
    : (selectedCol + baseMov[0] == col && selectedRow + baseMov[1] == row) ||
        (selectedCol - baseMov[1] == col && selectedRow + baseMov[0] == row) ||
        (selectedCol - baseMov[0] == col && selectedRow - baseMov[1] == row) ||
        (selectedCol + baseMov[1] == col && selectedRow - baseMov[0] == row);
};

/**
 * Componente de ficha de color
 *
 * Renderiza una ficha de color con funcionalidad para jugar cartas de movimiento y figura.
 * El componente realiza validaciones de movimientos, cambios de estado y envía peticiones
 * HTTP para actualizar el estado del juego en el servidor.
 *
 * @param {ColorTyleProps}
 * - `tyleId` (number): ID único de la ficha en el tablero.
 * - `col` (number): Columna en la que se encuentra la ficha.
 * - `row` (number): Fila en la que se encuentra la ficha.
 * - `color` (string): Color de la ficha (determina la clase CSS para el estilo).
 * - `blocked` (boolean): Indica si la ficha está bloqueada, afectando si puede seleccionarse o si se destaca.
 * - `tipo_figura` (number): Identifica el tipo de figura al que pertenece la ficha, necesario para validar movimientos.
 *
 * @return {JSX.Element} Boton ficha de color.
 */
const ColorTyle = ({
  tyleId,
  color,
  col,
  row,
  blocked,
  tipo_figura,
}: ColorTyleProps) => {
  const {
    selectedCard,
    setSelectedCard,
    selectedTyle,
    setSelectedTyle,
    currentTurn,
    selectedFigureCard,
    setSelectedFigureCard,
  } = useCurrentPlay();
  const cardType = selectedCard == null ? 0 : selectedCard[1];
  const cardId = selectedCard == null ? 0 : selectedCard[0];

  // HTTP request para jugar carta de movimiento
  const handleTyleSwap = async () => {
    try {
      // Datos necesarios para la request
      const game_id = sessionStorage.getItem("gameId");
      const casilla_id1 = selectedTyle[2];
      const casilla_id2 = tyleId;

      // PUT request
      const response = await axios.put(
        `/gamelist/${game_id}/playcard/${cardId}/casillas/${casilla_id1}/${casilla_id2}`
      );

      // Resetea valores de carta y ficha seleccionados
      setSelectedCard(null);
      setSelectedTyle(null);
    } catch (error) {
      console.error("Error swapping tyles:", error);
    }
  };

  // HTTP request para descartar carta figura
  const handleFigureDiscard = async () => {
    try {
      // Game ID necesario para la request
      const game_id = sessionStorage.getItem("gameId");

      // PUT request
      const response = await axios.put(
        `/gamelist/${game_id}/discard_figcard/${selectedFigureCard[0]}/color/${color}`
      );

      // Resetea valores de carta de figura seleccionada
      setSelectedFigureCard(null);
    } catch (error) {
      console.error("Error discarding card:", error);
    }
  };

  // HTTP request para bloquear carta figura
  const handleFigureBlock = async () => {
    try {
      // Game ID necesario para la request
      const game_id = sessionStorage.getItem("gameId");

      // PUT request
      const response = await axios.put(
        `/gamelist/${game_id}/block_figcard/${selectedFigureCard[0]}/color/${color}`
      );

      // Resetea valores de carta de figura seleccionada
      setSelectedFigureCard(null);
    } catch (error) {
      console.error("Error swapping tyles:", error);
    }
  };

  // Handler del click sobre la ficha
  const handleClick = () => {
    // Revisa si es el turno del jugador
    if (currentTurn == Number(sessionStorage.getItem("playerId"))) {
      // Caso en el que se juega una carta figura
      if (
        selectedTyle == null &&
        selectedCard == null &&
        selectedFigureCard != null &&
        selectedFigureCard[1] == tipo_figura
      ) {
        // Revisa de quien es la carta
        if (selectedFigureCard[2]) {
          handleFigureDiscard(); // Request de descarta carta figura propia
        } else {
          handleFigureBlock(); // Request de bloquea carta figura del rival
        }
      }
      // Caso en el que se juegagame carta movimiento
      else if (
        selectedTyle != null &&
        selectedCard != null &&
        selectedFigureCard == null &&
        availableMov(cardType, col, row, selectedTyle[0], selectedTyle[1])
      ) {
        handleTyleSwap(); // Request de jugar carta movimiento
      } else {
        setSelectedTyle(selectedTyle == null ? [col, row, tyleId] : null); // Caso de seleccionar/deseleccionar ficha
      }
    }
  };

  return (
    <div className={tipo_figura != -1 && !blocked ? "resaltado salto" : ""}>
      <button
        // Clase segun color, si esta seleccionada y si el color esta seleccionado
        className={`colorTyle ${color} ${
          selectedTyle != null && selectedTyle[2] == tyleId
            ? "selectedTyle"
            : ""
        } ${blocked ? "blocked" : ""}`}
        onClick={handleClick} // Evento de click
        disabled={
          // Deshabilita la ficha si hay otra seleccionada y no esta disponible como moviiento
          selectedTyle != null &&
          selectedTyle[2] != tyleId &&
          !availableMov(cardType, col, row, selectedTyle[0], selectedTyle[1])
        }
      >
        {selectedTyle != null && selectedTyle[2] == tyleId ? (
          <div className="squareMarker" /> // Renderiza "squareMarker" si es la ficha seleccionada
        ) : selectedTyle != null &&
          availableMov(cardType, col, row, selectedTyle[0], selectedTyle[1]) ? (
          <div className="circleMarker" /> // Renderiza "curcleMarker" si esta disponible para un movimiento
        ) : null}
      </button>
    </div>
  );
};

export default ColorTyle;
