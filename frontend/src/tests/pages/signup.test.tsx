import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SignUp from "../../pages/SignUp";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

describe("Sign Up Page", () => {
  it("should render heading", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const headingEl = screen.getByRole("heading", { name: "Sign Up" });

    expect(headingEl).toBeInTheDocument();
  });

  it("should have a sign up form form", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const emailInputEl = screen.getByLabelText("Your Email");
    const passwordInputEl = screen.getByLabelText("Password");
    const confirmPasswordInputEl = screen.getByLabelText("Confirm Password");
    const firstNameInputEl = screen.getByLabelText("First Name");
    const lastNameInputEl = screen.getByLabelText("Last Name");

    expect(emailInputEl).toBeInTheDocument();
    expect(passwordInputEl).toBeInTheDocument();
    expect(confirmPasswordInputEl).toBeInTheDocument();
    expect(firstNameInputEl).toBeInTheDocument();
    expect(lastNameInputEl).toBeInTheDocument();
  });
});
