import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import axios from "axios";
import { useNavigate, BrowserRouter } from "react-router-dom";
import QuitBtn from "../components/QuitBtn/QuitBtn";

// Mock de HTTP requests
jest.mock("axios");

// Mock de useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("QuitBtn Component", () => {
  beforeEach(() => {
    // Limpia sessionStorage y los mocks antes de cada test
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("should render the button correctly", () => {
    const { getByRole } = render(<QuitBtn />);

    // Revisa que de renderize de forma correcta
    expect(
      getByRole("button", { name: "ABANDONAR PARTIDA" })
    ).toBeInTheDocument();
  });

  it("should call quit function on button click", async () => {
    // Mockea una funcion "navigate" para que useNavigate lo retorne
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    // Asigna valor a playerId para que set use en el PUT
    sessionStorage.setItem("playerId", "1");
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByRole } = render(
      <BrowserRouter>
        <QuitBtn />
      </BrowserRouter>
    );

    // Clickea el boton para disparar el PUT y navigate
    fireEvent.click(getByRole("button", { name: "ABANDONAR PARTIDA" }));

    await waitFor(() => {
      // Revisa que se haya mandado el PUT
      expect(axios.put).toHaveBeenCalledWith("/gamelist/leave/1");

      // Revisa que se haya llamado a navigate
      expect(navigate).toHaveBeenCalledWith("/lobby");
    });
  });
});
