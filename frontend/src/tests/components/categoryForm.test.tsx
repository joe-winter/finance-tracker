import CategoryForm from "@/components/CategoryForm";
import { UserService } from "@/services/user";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/services/user", () => ({
  UserService: {
    updateCategories: vi.fn(),
    getUserData: vi.fn(),
  },
}));

describe("Category form", () => {
  it("should have input form for given type", async () => {
    const user = userEvent.setup();
    render(
      <CategoryForm
        type={"expenses"}
        placeholder={"Enter expense here"}
        refresh={false}
        setRefresh={vi.fn()}
      />
    );

    const inputEl = screen.getByPlaceholderText("Enter expense here");

    await user.type(inputEl, "Bills");

    expect(inputEl).toHaveValue("Bills");
  });
  it("should have a button element", () => {
    render(<CategoryForm refresh={false} setRefresh={vi.fn()} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
  it("should call function with updated categories", async () => {
    window.localStorage.setItem("token", "testToken");
    const user = userEvent.setup();
    const categories = {
      expenses: ["Rent", "Groceries", "Transportation"],
      income: ["Salary", "Freelancing"],
      savings: ["Emergency Fund", "Vacation"],
    };
    const updatedCategories = {
      expenses: ["Rent", "Groceries", "Transportation", "Bills"],
      income: ["Salary", "Freelancing"],
      savings: ["Emergency Fund", "Vacation"],
    };

    render(
      <CategoryForm
        type={"expenses"}
        placeholder={"Enter expense here"}
        categories={categories}
        refresh={false}
        setRefresh={vi.fn()}
      />
    );

    const inputEl = screen.getByPlaceholderText("Enter expense here");
    const buttonEl = screen.getByRole("button");
    await user.type(inputEl, "Bills");
    await user.click(buttonEl);

    expect(UserService.updateCategories).toHaveBeenCalledWith(
      "testToken",
      updatedCategories
    );
  });
});
