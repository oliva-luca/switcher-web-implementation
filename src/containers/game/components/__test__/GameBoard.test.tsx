import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  getAllByPlaceholderText,
  getAllByRole,
} from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import GameBoard from "../mainBoard/GameBoard";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2");

describe("GameBoard Component", () => {
  it("should render the board and 36 tyles", async () => {
    const board = {
      color_principa: 0,
      id_tablero: 0,
      casillas: Array(36).fill({
        id_casilla: 0,
        color: "rojo",
        columna: 0,
        fila: 0,
        id_tablero: 0,
      }),
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: board });

    const { container } = render(
      <Router>
        <GameBoard />
      </Router>
    );
    await waitFor(() => {
      const boardElement = container.querySelector(".boardSquare.boardGrid");
      expect(boardElement).toBeInTheDocument();

      const colorTyles = container.querySelectorAll(".colorTyle");
      expect(colorTyles.length).toBe(36);
    });
  });

  it("should render ColorTyle components with the correct colors", async () => {
    const board = {
      color_principa: 0,
      id_tablero: 0,
      casillas: [
        { id_casilla: 0, color: "rojo", columna: 0, fila: 0, id_tablero: 0 },
        {
          id_casilla: 1,
          color: "amarillo",
          columna: 1,
          fila: 0,
          id_tablero: 0,
        },
        { id_casilla: 2, color: "azul", columna: 2, fila: 0, id_tablero: 0 },
        { id_casilla: 3, color: "verde", columna: 3, fila: 0, id_tablero: 0 },
      ],
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: board });

    const { container } = render(
      <Router>
        <GameBoard />
      </Router>
    );

    await waitFor(() => {
      const rojo = container.querySelector(".rojo");
      const amarillo = container.querySelector(".amarillo");
      const azul = container.querySelector(".azul");
      const verde = container.querySelector(".verde");

      expect(azul).toBeInTheDocument();
      expect(verde).toBeInTheDocument();
      expect(amarillo).toBeInTheDocument();
      expect(rojo).toBeInTheDocument();
    });
  });

  it("should render Couldn't load board", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: null });

    const { getByText } = render(
      <Router>
        <GameBoard />
      </Router>
    );
    await waitFor(() => {
      const boardElement = getByText("Couldn't load board");
      expect(boardElement).toBeInTheDocument();
    });
  });
});
