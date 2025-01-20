import DynamicFormInput from "@/components/TransactionTable/DynamicFormInput";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const onChange = vi.fn();


describe("drop down with auto complete", () => {
  it("has given placeholder", () => {
    render(
      <DynamicFormInput
        placeholder={"Type"}
        onChange={onChange}
        size={18}
        value=""
      />
    );

    const inputEl = screen.getByPlaceholderText("Type");
    expect(inputEl).toBeInTheDocument();
  });
  it("has dropdown button", () => {
    const choices = ["expenses", "income", "savings"];
    render(
      <DynamicFormInput
        placeholder={"Type"}
        choices={choices}
        onChange={onChange}
        size={18}
        value=""
      />
    );

    const buttonEl = screen.getByTestId("chevron-down");
    expect(buttonEl).toBeInTheDocument();
  });
  it("given choices when a clicks they appear below", async () => {
    const user = userEvent.setup();
    const choices = ["expenses", "income", "savings"];

    render(
      <DynamicFormInput
        placeholder={"Type"}
        choices={choices}
        onChange={onChange}
        size={18}
        value=""
      />
    );

    const buttonEl = screen.getByTestId("chevron-down");

    expect(screen.queryByText("Expenses")).toBeNull();
    expect(screen.queryByText("Income")).toBeNull();
    expect(screen.queryByText("Savings")).toBeNull();

    await user.click(buttonEl);

    expect(screen.getByText("Expenses")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Savings")).toBeInTheDocument();
  });
  it("when an option is selected is value is changed", async () => {
    const user = userEvent.setup();
    const choices = ["expenses", "income", "savings"];

    const onChange = vi.fn();

    render(
      <DynamicFormInput
        placeholder={"Type"}
        choices={choices}
        onChange={onChange}
        size={18}
        value=""
      />
    );

    const buttonEl = screen.getByTestId("chevron-down");
    await user.click(buttonEl);
    const optionButtonEl = screen.getByRole("button", { name: "Savings" });
    await user.click(optionButtonEl);

    expect(onChange).toHaveBeenCalledWith("savings");
  });
  it("given a alue the input value changes", () => {
    render(
      <DynamicFormInput
        placeholder={"Type"}
        value={"savings"}
        onChange={onChange}
        size={18}
      />
    );
    const inputEl = screen.getByPlaceholderText("Type");
    expect(inputEl).toHaveValue("Savings");
  });
  it("when no choices are given, there is no dropdown", () => {
    render(
      <DynamicFormInput
        placeholder={"Amount"}
        onChange={onChange}
        size={18}
        value=""
      />
    );

    const buttonEl = screen.queryByTestId("chevron-down");
    expect(buttonEl).toBeNull();
  });
  it("resets value if value is no longer in options", () => {
    const choices = ["expenses", "income", "savings"];

    const onChange = vi.fn();

    render(
      <DynamicFormInput
        placeholder={"Type"}
        choices={choices}
        onChange={onChange}
        value={"test"}
        size={18}
      />
    );

    expect(onChange).toHaveBeenCalledWith("");
  });
  it("doesnt capitalise the string if type isnt text", () => {

  })
});
