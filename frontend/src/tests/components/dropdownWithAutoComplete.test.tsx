import DropdownWithAutoComplete from "@/components/TransactionTable/DropdownWithAutoComplete";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("drop down with auto complete", () => {
  it("has given placeholder", () => {
    render(<DropdownWithAutoComplete placeholder={"Type"} />);

    const inputEl = screen.getByPlaceholderText("Type");
    expect(inputEl).toBeInTheDocument();
  });
  it("has dropdown button", () => {
    render(<DropdownWithAutoComplete placeholder={"Type"} />);

    const buttonEl = screen.getByTestId("chevron-svg");
    expect(buttonEl).toBeInTheDocument();
  });
  it("given options when a clicks they appear below", async () => {
    const user = userEvent.setup();
    const options = ["expenses", "income", "savings"];

    render(<DropdownWithAutoComplete placeholder={"Type"} options={options} />);

    const buttonEl = screen.getByTestId("chevron-svg");

    expect(screen.queryByText("Expenses")).toBeNull();
    expect(screen.queryByText("Income")).toBeNull();
    expect(screen.queryByText("Savings")).toBeNull();

    await user.click(buttonEl);

    expect(screen.getByText("Expenses")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Savings")).toBeInTheDocument();
  });
  it("when an option is selected is state is changed", async () => {
    const user = userEvent.setup();
    const options = ["expenses", "income", "savings"];

    const setStateFunc = vi.fn();

    render(
      <DropdownWithAutoComplete
        placeholder={"Type"}
        options={options}
        setStateFunc={setStateFunc}
      />
    );

    const buttonEl = screen.getByTestId("chevron-svg");
    await user.click(buttonEl);
    const optionButtonEl = screen.getByRole("button", { name: "Savings" });
    await user.click(optionButtonEl);

    expect(setStateFunc).toHaveBeenCalledWith("savings");
  });
  it("given a alue the input value changes", () => {
    render(<DropdownWithAutoComplete placeholder={"Type"} state={"savings"} />);
    const inputEl = screen.getByPlaceholderText("Type");
    expect(inputEl).toHaveValue("Savings");
  });
});
