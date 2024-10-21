import React from "react";
import { render, screen, act } from "@testing-library/react";
import Timer from "../components/Timer/Timer";
import axios from "axios";
import { CurrentPlayProvider } from "../hooks/CurrentPlay.context";

jest.mock("axios");


describe("Timer Component", () => {

    it("Should renders correctly", () => {
        render(
            <CurrentPlayProvider>
                <Timer />
            </CurrentPlayProvider>
        );
        expect(screen.getByText("TIEMPO")).toBeInTheDocument();
        expect(screen.getByText("RESTANTE")).toBeInTheDocument();
    });
});