import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { useNavigate } from "react-router-dom";
import LobbyBtn from "../components/lobbyBtn/LobbyBtn";

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
    const { getByRole } = render(<LobbyBtn />);

    // Revisa que de renderize de forma correcta
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("should call navigate on button click", async () => {
    // Mockea una funcion "navigate" para que useNavigate lo retorne
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const { getByRole } = render(<LobbyBtn />);

    // Clickea el boton para disparar el PUT y navigate
    fireEvent.click(getByRole("button"));

    // Revisa que se haya llamado a navigate
    expect(navigate).toHaveBeenCalledWith("/lobby");
  });
});
