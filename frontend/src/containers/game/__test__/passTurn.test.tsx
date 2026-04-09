import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import PassTurn from "../components/passTurn/passTurn";
import axios from "axios";
import { CurrentPlayProvider } from "../hooks/CurrentPlay.context";

jest.mock("axios");

describe("PassTurn Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should render the component and display "TURNO DE"', () => {
    const { getByText } = render(
      <CurrentPlayProvider>
        <PassTurn />
      </CurrentPlayProvider>
    );
    expect(getByText("TURNO DE")).toBeInTheDocument();
  });

  it("should fetch game data and update state correctly", async () => {
    sessionStorage.setItem("gameId", "1");
    const gameData = { turn: 1 };
    const userData = { nombre: "Player 1" };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: gameData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: userData });

    const { getByText } = render(
      <CurrentPlayProvider>
        <PassTurn />
      </CurrentPlayProvider>
    );

    await waitFor(() => {
      expect(getByText("TURNO DE")).toBeInTheDocument();
      expect(getByText("Player 1")).toBeInTheDocument();
    });
  });

  it("should handle errors when fetching game data", async () => {
    sessionStorage.setItem("gameId", "1");
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <CurrentPlayProvider>
        <PassTurn />
      </CurrentPlayProvider>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching game data:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should disable "PASAR TURNO" button if it is not the user\'s turn', async () => {
    sessionStorage.setItem("gameId", "1");
    sessionStorage.setItem("playerId", "2");
    const gameData = { turn: 1 };
    const userData = { nombre: "Player 1" };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: gameData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: userData });

    const { getByRole } = render(
      <CurrentPlayProvider>
        <PassTurn />
      </CurrentPlayProvider>
    );

    await waitFor(() => {
      const button = getByRole("button", { name: "PASAR TURNO" });
      expect(button).toBeDisabled();
    });
  });

  it('should enable "PASAR TURNO" button if it is the user\'s turn', async () => {
    sessionStorage.setItem("gameId", "1");
    sessionStorage.setItem("playerId", "1");
    const gameData = { turn: 1 };
    const userData = { nombre: "Messi" };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: gameData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: userData });

    const { getByRole } = render(
      <CurrentPlayProvider>
        <PassTurn />
      </CurrentPlayProvider>
    );

    await waitFor(() => {
      const button = getByRole("button", { name: "PASAR TURNO" });
      expect(button).toBeEnabled();
    });
  });

  it("should make PUT request to end turn", async () => {
    sessionStorage.setItem("gameId", "1");
    sessionStorage.setItem("playerId", "1");
    const gameData = { turn: 1 };
    const userData = { nombre: "Messi" };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: gameData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: userData });
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByRole } = render(
      <CurrentPlayProvider>
        <PassTurn />
      </CurrentPlayProvider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/gamelist/1");
      expect(axios.get).toHaveBeenCalledWith("/user/1");
    });

    fireEvent.click(getByRole("button", { name: "PASAR TURNO" }));

    await waitFor(() => {
      const gameId = sessionStorage.getItem("gameId");
      expect(axios.put).toHaveBeenCalledWith(`/end_turn/${gameId}`);
    });
  });

  it("should log an error if PUT request fails", async () => {
    sessionStorage.setItem("gameId", "1");
    sessionStorage.setItem("playerId", "1");
    const gameData = { turn: 1 };
    const userData = { nombre: "Messi" };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: gameData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: userData });
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (axios.put as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const { getByRole } = render(
      <CurrentPlayProvider>
        <PassTurn />
      </CurrentPlayProvider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/gamelist/1");
      expect(axios.get).toHaveBeenCalledWith("/user/1");
    });

    fireEvent.click(getByRole("button", { name: "PASAR TURNO" }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error ending turn:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
