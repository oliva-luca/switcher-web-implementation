import React from "react";
import { render, screen, act } from "@testing-library/react";
import Timer from "../components/Timer/Timer";
import axios from "axios";
import { CurrentPlayProvider } from "../hooks/CurrentPlay.context";

// Mock de la librería axios para interceptar y simular respuestas HTTP
jest.mock("axios");

describe("Timer Component", () => {
  // Variable para almacenar el WebSocket simulado
  let mockWebSocket: any;

  beforeEach(() => {
    // Limpia los mocks de jest antes de cada prueba
    jest.clearAllMocks();

    // Inicializa un mock para los handlers de eventos del WebSocket
    mockWebSocket = {
      onopen: jest.fn(),
      onmessage: jest.fn(),
      onclose: jest.fn(),
      onerror: jest.fn(),
      close: jest.fn(),
    };

    // Sobreescribe el WebSocket global con el mock
    (global as any).WebSocket = jest.fn(() => mockWebSocket);

    // Configura valores en sessionStorage necesarios para la prueba
    sessionStorage.setItem("gameId", "1");
  });

  afterEach(() => {
    // Borra la referencia de WebSocket del objeto global
    delete (global as any).WebSocket;
  });

  it("Should renders correctly", () => {
    // Renderiza el componente Timer y verifica elementos básicos en pantalla
    render(
      <CurrentPlayProvider>
        <Timer />
      </CurrentPlayProvider>
    );

    // Comprueba que los textos "TIEMPO" y "RESTANTE" están presentes en el documento
    expect(screen.getByText("TIEMPO")).toBeInTheDocument();
    expect(screen.getByText("RESTANTE")).toBeInTheDocument();
  });

  it("should handle expected WebSocket messages", async () => {
    // Mock de respuesta GET para obtener el tiempo inicial de 120 segundos
    (axios.get as jest.Mock).mockResolvedValue({ data: 120 });

    // Renderiza el componente Timer con contexto de juego
    render(
      <CurrentPlayProvider>
        <Timer />
      </CurrentPlayProvider>
    );

    // Simula la apertura del WebSocket
    await act(async () => {
      mockWebSocket.onopen();
    });

    // Simula la recepción de un mensaje esperado del WebSocket
    await act(async () => {
      mockWebSocket.onmessage({ data: "Turno del jugador" });
    });

    // Verifica que el tiempo se muestra correctamente en el formato "2:00"
    expect(screen.getByText("2:00")).toBeInTheDocument();
  });

  it("should handle unexpected WebSocket messages", async () => {
    // Mock de respuesta GET para obtener el tiempo inicial de 60 segundos
    (axios.get as jest.Mock).mockResolvedValue({ data: 60 });

    // Renderiza el componente Timer
    render(
      <CurrentPlayProvider>
        <Timer />
      </CurrentPlayProvider>
    );

    // Simula la apertura del WebSocket
    await act(async () => {
      mockWebSocket.onopen();
    });

    // Simula la recepción de un mensaje inesperado del WebSocket
    await act(async () => {
      mockWebSocket.onmessage({ data: "Mensaje malo :(" });
    });

    // Verifica que el tiempo se muestra correctamente en el formato "1:00"
    expect(screen.getByText("1:00")).toBeInTheDocument();
  });
});
