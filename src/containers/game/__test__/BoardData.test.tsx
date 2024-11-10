import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import { useBoard } from "../hooks/BoardData.hook";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useBoard hook", () => {
  const mockBoardData = {
    id: 1,
    tiles: [
      { id: 1, color: "red", row: 1, col: 1 },
      { id: 2, color: "blue", row: 1, col: 2 },
    ],
  };

  afterEach(() => {
    mockedAxios.get.mockClear();
    sessionStorage.clear();
  });

  it("should fetch and set board data correctly", async () => {
    sessionStorage.setItem("gameId", "1");

    mockedAxios.get.mockResolvedValueOnce({ data: mockBoardData });

    const { result } = renderHook(() => useBoard());

    expect(result.current.board).toBeNull();
    await waitFor(() => expect(result.current.board).toEqual(mockBoardData));
    expect(mockedAxios.get).toHaveBeenCalledWith("/tableros/1");
  });

  it("should handle errors when fetching the board data", async () => {
    sessionStorage.setItem("gameId", "2");

    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useBoard());

    expect(result.current.board).toBeNull();
    await waitFor(() => expect(result.current.board).toBeNull());
    expect(result.current.board).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching the game list:",
      expect.any(Error)
    );
    expect(mockedAxios.get).toHaveBeenCalledWith("/tableros/2");
    consoleSpy.mockRestore();
  });
});
