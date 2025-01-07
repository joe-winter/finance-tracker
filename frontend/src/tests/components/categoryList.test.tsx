import CategoryList from "@/components/CategoryList";
import { UserService } from "@/services/user";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/services/user", () => ({
  UserService: {
    updateCategories: vi.fn(),
    getUserData: vi.fn(),
  },
}));

describe("category list", () => {
  it("should display given category list", () => {
    const categories = {
      expenses: ["Rent", "Groceries", "Transportation"],
      income: ["Salary", "Freelancing"],
      savings: ["Emergency Fund", "Vacation"],
    };

    render(
      <CategoryList
        type={"expenses"}
        categories={categories}
        refresh={false}
        setRefresh={vi.fn()}
      />
    );

    const textEl1 = screen.getByText("Rent");
    const textEl2 = screen.getByText("Groceries");
    const textEl3 = screen.getByText("Transportation");

    expect(textEl1).toBeInTheDocument();
    expect(textEl2).toBeInTheDocument();
    expect(textEl3).toBeInTheDocument();
  });
  it("has a delete button for each category", () => {
    const categories = {
      expenses: ["Rent", "Groceries", "Transportation"],
      income: ["Salary", "Freelancing"],
      savings: ["Emergency Fund", "Vacation"],
    };
    render(
      <CategoryList
        type={"expenses"}
        categories={categories}
        refresh={false}
        setRefresh={vi.fn()}
      />
    );

    const buttonEls = screen.getAllByRole("button");
    expect(buttonEls.length).toEqual(3);
  });
  it("when a user clicks delete the update function is called", async () => {
    const user = userEvent.setup();
    localStorage.setItem("token", "testToken");
    const categories = {
      expenses: ["Rent", "Groceries", "Transportation"],
      income: ["Salary", "Freelancing"],
      savings: ["Emergency Fund", "Vacation"],
    };
    const updateCategories = {
      expenses: ["Groceries", "Transportation"],
      income: ["Salary", "Freelancing"],
      savings: ["Emergency Fund", "Vacation"],
    };
    render(
      <CategoryList
        type={"expenses"}
        categories={categories}
        refresh={false}
        setRefresh={vi.fn()}
      />
    );

    const buttonEls = screen.getAllByRole("button");
    await user.click(buttonEls[0]);

    expect(UserService.updateCategories).toHaveBeenCalledWith(
      "testToken",
      updateCategories
    );
  });
});
