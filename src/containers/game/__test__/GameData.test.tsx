import React from "react";
import { render, act } from "@testing-library/react";
import { useGame } from "../hooks/GameData.hook";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

jest.mock("axios");
jest.mock("sweetalert2");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

const TestComponent = () => {
  const { game, gameInfoKey } = useGame();
  return <div>{game && game.name}</div>;
};

describe("useGame hook", () => {
  let mockWebSocket: any;
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    mockWebSocket = {
      onopen: jest.fn(),
      onmessage: jest.fn(),
      onclose: jest.fn(),
      onerror: jest.fn(),
      close: jest.fn(),
    };

    (global as any).WebSocket = jest.fn(() => mockWebSocket);
    sessionStorage.setItem("playerId", "1");
    sessionStorage.setItem("gameId", "1");
  });

  afterEach(() => {
    delete (global as any).WebSocket;
  });

  test("should handle WebSocket messages", async () => {
    const mockGameData = { id_partida: 1, name: "Test Game", started: false };

    (axios.get as jest.Mock).mockResolvedValue({ data: mockGameData });

    const { findByText } = render(<TestComponent />);

    await act(async () => {
      mockWebSocket.onopen();
    });

    await act(async () => {
      mockWebSocket.onmessage({ data: "winner 1" });
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "¡Ganaste!",
      text: "Felicidades, has ganado la partida.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    expect(navigate).toHaveBeenCalledWith("/lobby");
  });

  test("should close WebSocket on component unmount", async () => {
    const { unmount } = render(<TestComponent />);

    unmount();

    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
