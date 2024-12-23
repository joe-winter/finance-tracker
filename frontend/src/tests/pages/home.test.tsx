import Home from "../../pages/Home";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { useNavigate } from "react-router-dom";


vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, useParams: vi.fn() };
});


describe("Home Page", () => {
  it("should have a log in button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const buttonEl = screen.getByRole("button", { name: "Log In" });
    expect(buttonEl).toBeInTheDocument();
  });
  it("should have a sign up button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const buttonEl = screen.getByRole("button", { name: "Sign Up" });
    expect(buttonEl).toBeInTheDocument();
  });
  it("navigates to login in when clicking button", async () => {
    const user = userEvent.setup();
    const navigateMock = useNavigate();
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const buttonEl = screen.getByRole("button", { name: "Log In" });

    await user.click(buttonEl);

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
  it("navigates to signup in when clicking button", async () => {
    const user = userEvent.setup();
    const navigateMock = useNavigate();
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const buttonEl = screen.getByRole("button", { name: "Sign Up" });

    await user.click(buttonEl);

    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});
