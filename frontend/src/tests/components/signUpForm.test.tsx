import { signUp } from "../../services/authentication";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../../components/SignUpForm";
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, useParams: vi.fn() };
});

vi.mock("../../services/authentication.ts", () => {
  const signUpMock = vi.fn();
  return { signUp: signUpMock };
});

const signUpMock = signUp as ReturnType<typeof vi.fn>;

async function completeSignUpForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Your Email");
  const passwordInputEl = screen.getByLabelText("Password");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password");
  const firstNameInputEl = screen.getByLabelText("First Name");
  const lastNameInputEl = screen.getByLabelText("Last Name");
  const signUpButtonEl = screen.getByRole("button", { name: "Sign Up" });

  await user.type(emailInputEl, "someone@example.com");
  await user.type(passwordInputEl, "password123");
  await user.type(confirmPasswordInputEl, "password123");
  await user.type(firstNameInputEl, "John");
  await user.type(lastNameInputEl, "Doe");
  await user.click(signUpButtonEl);
}
describe("Sign Up Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should have input fields", () => {
    render(<SignUpForm />);

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
  it("should have placeholder text", () => {
    render(<SignUpForm />);

    const emailInputEl = screen.getByLabelText("Your Email");
    const passwordInputEl = screen.getByLabelText("Password");
    const confirmPasswordInputEl = screen.getByLabelText("Confirm Password");
    const firstNameInputEl = screen.getByLabelText("First Name");
    const lastNameInputEl = screen.getByLabelText("Last Name");

    expect(emailInputEl).toHaveAttribute("placeholder", "johndoe@example.com");
    expect(passwordInputEl).toHaveAttribute("placeholder", "••••••••");
    expect(confirmPasswordInputEl).toHaveAttribute("placeholder", "••••••••");
    expect(firstNameInputEl).toHaveAttribute("placeholder", "John");
    expect(lastNameInputEl).toHaveAttribute("placeholder", "Doe");
  });
  it("should show what is typed into the field", async () => {
    render(<SignUpForm />);

    const user = userEvent.setup();
    const emailInputEl = screen.getByLabelText("Your Email");
    const passwordInputEl = screen.getByLabelText("Password");
    const confirmPasswordInputEl = screen.getByLabelText("Confirm Password");
    const firstNameInputEl = screen.getByLabelText("First Name");
    const lastNameInputEl = screen.getByLabelText("Last Name");

    await user.type(emailInputEl, "someone@example.com");
    expect(emailInputEl).toHaveValue("someone@example.com");

    await user.type(passwordInputEl, "password123");
    expect(passwordInputEl).toHaveValue("password123");

    await user.type(confirmPasswordInputEl, "password123");
    expect(confirmPasswordInputEl).toHaveValue("password123");

    await user.type(firstNameInputEl, "John");
    expect(firstNameInputEl).toHaveValue("John");

    await user.type(lastNameInputEl, "Doe");
    expect(lastNameInputEl).toHaveValue("Doe");
  });

  it("should render sign in button", () => {
    render(<SignUpForm />);

    const SignUpButtonEl = screen.getByRole("button", { name: "Sign Up" });
    expect(SignUpButtonEl).toBeInTheDocument();
  });

  it("it should call sign up service with email and password", async () => {
    render(<SignUpForm />);
    await completeSignUpForm();

    expect(signUp).toHaveBeenCalledWith(
      "someone@example.com",
      "password123",
      "password123",
      "John",
      "Doe"
    );
  });

  it("should navigate to dashboard if si succesful", async () => {
    render(<SignUpForm />);

    await completeSignUpForm();

    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });
  it("navigates to /signup if sign up unsuccesful", async () => {
    render(<SignUpForm />);
    signUpMock.mockRejectedValue(new Error("Error signing up"));
    const navigateMock = useNavigate();
    await completeSignUpForm();
    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});
