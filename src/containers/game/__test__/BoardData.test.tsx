import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import { useBoard } from "../hooks/BoardData.hook";

// Mock de HTTP requests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useBoard hook", () => {
  // Mock de los datos del tablero
  const mockBoardData = {
    id: 1,
    tiles: [
      { id: 1, color: "red", row: 1, col: 1 },
      { id: 2, color: "blue", row: 1, col: 2 },
    ],
  };

  afterEach(() => {
    // Limpia sessionStorage y los mocks despues de cada test
    mockedAxios.get.mockClear();
    sessionStorage.clear();
  });

  it("should fetch and set board data correctly", async () => {
    // Asigna valor correcto de gameId a sessionStorage
    sessionStorage.setItem("gameId", "1");

    mockedAxios.get.mockResolvedValueOnce({ data: mockBoardData });

    const { result } = renderHook(() => useBoard());

    // Revisa que el tablero arranque en null
    expect(result.current.board).toBeNull();

    // Manda el mockBoardData y se asegura que haya sido llamado
    await waitFor(() => expect(result.current.board).toEqual(mockBoardData));
    expect(mockedAxios.get).toHaveBeenCalledWith("/tableros/1");
  });

  it("should handle errors when fetching the board data", async () => {
    // Asigna valor incorrecto de gameId a sessionStorage
    sessionStorage.setItem("gameId", "2");

    // Mockea el valor de retorno en caso de error
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useBoard());

    // Revisa que el tablero arranque en null
    expect(result.current.board).toBeNull();
    await waitFor(() => expect(result.current.board).toBeNull());

    // Revisa que el tablero siga en null
    expect(result.current.board).toBeNull();

    // Revisa que el error haya salido por consola
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching the game list:",
      expect.any(Error)
    );

    // Revisa que el GET haya sido llamado
    expect(mockedAxios.get).toHaveBeenCalledWith("/tableros/2");

    // Limpia el mock de la consola
    consoleSpy.mockRestore();
  });
});
