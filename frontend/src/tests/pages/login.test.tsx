import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "../../pages/Login";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

describe("Login Page", () => {
  it("should render heading", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const headingEl = screen.getByRole("heading", { name: "Login" });

    expect(headingEl).toBeInTheDocument();
  });

  it("should have a login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInputEl = screen.getByLabelText("Your Email");
    expect(emailInputEl).toBeInTheDocument();

    const passwordInputEl = screen.getByLabelText("Password");
    expect(passwordInputEl).toBeInTheDocument();
  });
});
