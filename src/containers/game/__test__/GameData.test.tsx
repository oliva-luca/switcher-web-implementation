import React from "react";
import { render, act } from "@testing-library/react";
import { useGame } from "../hooks/GameData.hook";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Mock de HTTP requests
jest.mock("axios");

// Mock de sweeralert2
jest.mock("sweetalert2");

// Mock de useNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Pasa datos del hook a un componente
const TestComponent = () => {
  const { game, gameInfoKey } = useGame();
  return <div>{game && game.name}</div>;
};

describe("useGame hook", () => {
  // Variable WebSocket
  let mockWebSocket: any;

  // Mock de navigate
  const navigate = jest.fn();

  beforeEach(() => {
    // Limpia mocks
    jest.clearAllMocks();

    // Asigna navigate para que useNavigate lo retorne
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    // Mock de handlers de eventos del WebSocket
    mockWebSocket = {
      onopen: jest.fn(),
      onmessage: jest.fn(),
      onclose: jest.fn(),
      onerror: jest.fn(),
      close: jest.fn(),
    };

    // Mock del WebSocket
    (global as any).WebSocket = jest.fn(() => mockWebSocket);

    // Asigna valores necesarios del sessionStorage
    sessionStorage.setItem("playerId", "1");
    sessionStorage.setItem("gameId", "1");
  });

  afterEach(() => {
    // Borra WebSocket
    delete (global as any).WebSocket;
  });

  test("should handle WebSocket messages", async () => {
    // Mock del GET
    const mockGameData = { id_partida: 1, name: "Test Game", started: false };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockGameData });

    const { findByText } = render(<TestComponent />);

    // Espera a que se abra el WebSocket
    await act(async () => {
      mockWebSocket.onopen();
    });

    // Espera a que el WebSocket mande un mensaje
    await act(async () => {
      mockWebSocket.onmessage({ data: "winner 1" });
    });

    // Revisa que aparezca el alert del ganador
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "¡Ganaste!",
      text: "Felicidades, has ganado la partida.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    /// Revisa que se haya llamado a navigate
    expect(navigate).toHaveBeenCalledWith("/lobby");
  });

  test("should close WebSocket on component unmount", async () => {
    const { unmount } = render(<TestComponent />);

    // Desmonta el WebSocket
    unmount();

    // Revisa que el WebSocket este cerrado
    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
