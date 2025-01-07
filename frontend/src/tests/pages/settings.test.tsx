import { useNavigate } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Settings from "../../pages/Settings";
import { UserService } from "@/services/user";
import { act } from "react";
import userEvent from "@testing-library/user-event";

vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, useParams: vi.fn() };
});

vi.mock("@/services/user", () => ({
  UserService: {
    updateCategories: vi.fn(),
    getUserData: vi.fn(),
  },
}));

describe("Settings Page", () => {
  it("should navigate to login if no token is present", () => {
    render(<Settings />);

    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
  it("should display given user data", async () => {
    const user = {
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      categories: {
        expenses: ["Rent", "Groceries", "Transportation"],
        income: ["Salary", "Freelancing"],
        savings: ["Emergency Fund", "Vacation"],
      },
    };
    // Setting token in localStorage before rendering
    window.localStorage.setItem("token", "testToken");

    // Mocking the user data response from the API
    vi.mocked(UserService.getUserData).mockResolvedValue({
      user: user,
      token: "newToken",
    });

    // Wrapping render inside act to ensure all async effects are processed
    await act(async () => {
      render(<Settings />);
    });
    const emailEl = screen.getByText("Email: john.doe@example.com");
    const nameEl = screen.getByText("Name: John Doe");
    const typeEl = screen.getByText("Expenses:");
    const categoryEl = screen.getByText("Salary");
    expect(emailEl).toBeInTheDocument();
    expect(nameEl).toBeInTheDocument();
    expect(typeEl).toBeInTheDocument();
    expect(categoryEl).toBeInTheDocument();
  });
  it("should fetch user data from backend", async () => {
    window.localStorage.setItem("token", "testToken");
    await act(async () => {
      render(<Settings />);
    });

    expect(UserService.getUserData).toHaveBeenCalledWith("testToken");
  });
  it("it should have input fields and add buttons for each type", () => {
    render(<Settings />);

    const expensesInputEl = screen.getByPlaceholderText("Enter expense here");
    expect(expensesInputEl).toBeInTheDocument();

    const buttonEls = screen.getAllByRole("button");
    expect(buttonEls[5]).toHaveTextContent("+");
  });
});
