import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import CancelMov from "../components/cancelMov/cancelMov";
import {
  CurrentPlayProvider,
  useCurrentPlay,
} from "../hooks/CurrentPlay.context";

// Mock de solicitudes HTTP de axios
jest.mock("axios");

// Mock del contexto useCurrentPlay para controlar el valor de currentTurn durante las pruebas.
jest.mock("../hooks/CurrentPlay.context", () => ({
  useCurrentPlay: jest.fn(),
}));

describe("CancelMov Component", () => {
  // Configuración inicial antes de cada prueba
  beforeEach(() => {
    // Mock de useCurrentPlay para que devuelva curentTurn
    (useCurrentPlay as jest.Mock).mockReturnValue({
      currentTurn: 1, // Indica que el jugador actual es el 1.
    });

    // Valores de sessionStorage para tests
    sessionStorage.setItem("gameId", "12345");
    sessionStorage.setItem("playerId", "1");
  });

  afterEach(() => {
    // Limpia los mocks y el session storage después de cada test
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("should call axios.put with the correct URL when button is clicked", async () => {
    // Mock PUT request
    axios.put.mockResolvedValue({});

    const { getByRole } = render(<CancelMov />);
    const button = getByRole("button", { name: "CANCELAR MOVIMIENTOS" });

    // Simula un clic en el botón
    fireEvent.click(button);

    // Espera a que la PUT request sea llamada con la URL correcta
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/gamelist/cancelmoves/12345");
    });
  });

  it("should log error to console when axios.put fails", async () => {
    // EMock de console.log para verificar si se registran los errores
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Mock de axios.put para que falle y devuelva un error
    axios.put.mockRejectedValue(new Error("Network Error"));

    const { getByRole } = render(<CancelMov />);
    const button = getByRole("button", { name: "CANCELAR MOVIMIENTOS" });

    // Simula un clic en el botón
    fireEvent.click(button);

    // Espera a que se registre el error en la consola
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(new Error("Network Error"));
    });

    // Restaura el espía de la consola
    consoleSpy.mockRestore();
  });

  it("shouldn't call axios.put when button is clicked by a different player", async () => {
    // Cambia sessionStorage para simular que el jugador 2 está haciendo click
    sessionStorage.setItem("playerId", "2");

    // Mock PUT request
    axios.put.mockResolvedValue({});

    const { getByRole } = render(<CancelMov />);
    const button = getByRole("button", { name: "CANCELAR MOVIMIENTOS" });

    // Simula un clic en el botón
    fireEvent.click(button);

    // Espera a que el PUT request no sea llamado
    await waitFor(() => {
      expect(axios.put).not.toHaveBeenCalledWith("/gamelist/cancelmoves/12345");
    });
  });
});
