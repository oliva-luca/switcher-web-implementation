import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import CancelMov from "../components/cancelMov/cancelMov";
import {
  CurrentPlayProvider,
  useCurrentPlay,
} from "../hooks/CurrentPlay.context";

jest.mock("axios");
jest.mock("../hooks/CurrentPlay.context", () => ({
  useCurrentPlay: jest.fn(),
}));

describe("CancelMov Component", () => {
  beforeEach(() => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      currentTurn: 1,
    });
    sessionStorage.setItem("gameId", "12345");
    sessionStorage.setItem("playerId", "1");
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("should call axios.put with the correct URL when button is clicked", async () => {
    axios.put.mockResolvedValue({});

    const { getByRole } = render(<CancelMov />);
    const button = getByRole("button", { name: "CANCELAR MOVIMIENTOS" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/gamelist/cancelmoves/12345");
    });
  });

  it("should log error to console when axios.put fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    axios.put.mockRejectedValue(new Error("Network Error"));

    const { getByRole } = render(<CancelMov />);
    const button = getByRole("button", { name: "CANCELAR MOVIMIENTOS" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(new Error("Network Error"));
    });

    consoleSpy.mockRestore();
  });

  it("shouldn't call axios.put when button is clicked by a different player", async () => {
    sessionStorage.setItem("playerId", "2");
    axios.put.mockResolvedValue({});

    const { getByRole } = render(<CancelMov />);
    const button = getByRole("button", { name: "CANCELAR MOVIMIENTOS" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.put).not.toHaveBeenCalledWith("/gamelist/cancelmoves/12345");
    });
  });
});
