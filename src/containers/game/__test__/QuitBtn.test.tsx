import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QuitBtn from "../components/QuitBtn/QuitBtn"; // Ajusta la ruta de importación según sea necesario

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("QuitBtn Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("should render the button correctly", () => {
    const { getByRole } = render(<QuitBtn />);
    expect(
      getByRole("button", { name: "ABANDONAR PARTIDA" })
    ).toBeInTheDocument();
  });

  it("should call quit function on button click", async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    sessionStorage.setItem("playerId", "1");
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByRole } = render(<QuitBtn />);
    fireEvent.click(getByRole("button", { name: "ABANDONAR PARTIDA" }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/gamelist/leave/1");
      expect(navigate).toHaveBeenCalledWith("/lobby");
    });
  });
});
