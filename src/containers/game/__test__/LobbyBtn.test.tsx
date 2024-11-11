import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { useNavigate } from "react-router-dom";
import LobbyBtn from "../components/lobbyBtn/LobbyBtn";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("QuitBtn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the button correctly", () => {
    const { getByRole } = render(<LobbyBtn />);
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should call navigate on button click", async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const { getByRole } = render(<LobbyBtn />);
    const button = getByRole("button");
    fireEvent.click(button);

    expect(navigate).toHaveBeenCalledWith("/lobby");
  });
});
