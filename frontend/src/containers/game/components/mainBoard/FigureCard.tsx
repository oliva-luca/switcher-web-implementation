import React from "react";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";
import "./FigureCard.css";

// Interfaz de propiedades del componente
interface FigureCardProp {
  cardID: number; // ID único de la carta
  type: number; // Tipo de la figura
  playerID?: number; // ID del jugador propietario de la carta
  blocked?: boolean; // Indica si la carta está bloqueada
}

/**
 * Componente de carta de figura
 *
 * Este componente representa una carta de figura que puede pertenecer al
 * jugador o al oponente y permite seleccionar, bloquear, o aplicar opacidad
 * en función de la propiedad `blocked` o del turno del jugador.
 *
 * La carta cambia su estilo en función del tipo de figura, si está bloqueada,
 * y si está seleccionada. Al hacer clic, actualiza el estado en `useCurrentPlay`
 * con la carta seleccionada.
 *
 * @param {FigureCardProp} props - Propiedades de la carta de figura:
 * - `cardID` (number): ID único de la carta.
 * - `type` (number): Tipo de la figura representada en la carta.
 * - `playerID` (number): ID del jugador propietario de la carta (opcional).
 * - `blocked` (boolean): Define si la carta está bloqueada (opcional).
 *
 * @return {JSX.Element} Carta de figura.
 */
const FigureCard = ({ cardID, type, playerID, blocked }: FigureCardProp) => {
  // Extrae funciones y estados relacionados al juego desde el contexto
  const {
    selectedFigureCard,
    setSelectedFigureCard,
    setSelectedCard,
    setSelectedTyle,
  } = useCurrentPlay();

  return (
    <img
      // Asigna un ID basado en el tipo de la figura
      id={type.toString()}
      className={"figCard"}
      src={
        // Define la fuente de la imagen en función del estado de la carta
        blocked
          ? "/back.svg" // Imagen de reverso si está bloqueada
          : type > 18
          ? "/fige0" + (type - 18) + ".svg" // Imagen para tipo de figura > 18
          : type < 10
          ? "/fig0" + type + ".svg" // Imagen para tipo de figura < 10
          : "/fig" + type + ".svg" // Imagen para otros tipos
      }
      style={{
        opacity:
          // Ajusta la opacidad según el jugador propietario y selección
          playerID?.toString() != sessionStorage.getItem("playerId")
            ? 1
            : (selectedFigureCard == null || selectedFigureCard[0] == cardID) &&
              playerID != 0
            ? 1
            : 0.5,
        border:
          // Resalta la carta si está seleccionada
          selectedFigureCard != null && selectedFigureCard[0] == cardID
            ? "3px solid white"
            : "none",
        borderRadius: "10px", // Bordes redondeados para la carta
      }}
      onClick={() => {
        // Resetea selección de casilla y carta de movimiento
        setSelectedTyle(null);
        setSelectedCard(null);

        // Actualiza la selección de la carta de figura
        setSelectedFigureCard(
          selectedFigureCard != null && selectedFigureCard[0] == cardID
            ? null // Deselecciona si ya estaba seleccionada
            : [
                cardID,
                type,
                playerID.toString() === sessionStorage.getItem("playerId")
                  ? true // Indica si la carta es del jugador actual
                  : false,
              ]
        );
      }}
      alt={`${cardID}`} // Alt text descriptivo con el ID de la carta
    />
  );
};

export default FigureCard;
