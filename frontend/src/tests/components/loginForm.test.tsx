import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginForm from "../../components/LoginForm";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { login } from "../../services/authentication";
import {  useNavigate } from "react-router-dom"

vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, useParams: vi.fn() };
});

vi.mock("../../services/authentication.ts", () => {
  return {
    login: vi.fn(),
  };
});

async function completeLoginForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Your Email");
  const passwordInputEl = screen.getByLabelText("Password");
  const logInButtonEl = screen.getByRole("button", { name: "Log In" });

  await user.type(emailInputEl, "someone@example.com");
  await user.type(passwordInputEl, "password123");
  await user.click(logInButtonEl);
}

describe("Login Form Component", () => {
  it("should have input fields", () => {
    render(<LoginForm />);

    const emailInputEl = screen.getByLabelText("Your Email");
    expect(emailInputEl).toBeInTheDocument();

    const passwordInputEl = screen.getByLabelText("Password");
    expect(passwordInputEl).toBeInTheDocument();
  });
  it("should have placeholder text", () => {
    render(<LoginForm />);

    const emailInputEl = screen.getByLabelText("Your Email");
    expect(emailInputEl).toHaveAttribute("placeholder", "johndoe@example.com");

    const passwordInputEl = screen.getByLabelText("Password");
    expect(passwordInputEl).toHaveAttribute("placeholder", "••••••••");
  });
  it("should show what is typed into the field", async () => {
    render(<LoginForm />);

    const user = userEvent.setup();

    const emailInputEl = screen.getByLabelText("Your Email");
    await user.type(emailInputEl, "someone@example.com");
    expect(emailInputEl).toHaveValue("someone@example.com");

    const passwordInputEl = screen.getByLabelText("Password");
    await user.type(passwordInputEl, "password123");
    expect(passwordInputEl).toHaveValue("password123");
  });

  it("should render login button", () => {
    render(<LoginForm />);

    const logInButtonEl = screen.getByRole("button", { name: "Log In" });
    expect(logInButtonEl).toBeInTheDocument();
  });

  it("it should call login service with email and password", async () => {
    render(<LoginForm />);
    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("someone@example.com", "password123");
  });

  it("should navigate to dashboard if login succesful", async () => {
    render(
      // <BrowserRouter>
        <LoginForm />
      // </BrowserRouter>q
    );

    await completeLoginForm();

    const navigateMock = useNavigate();

    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });
});
