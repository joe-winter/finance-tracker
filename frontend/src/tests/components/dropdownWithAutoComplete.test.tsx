import DropdownWithAutoComplete from "@/components/DropdownWithAutoComplete";
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

    expect(screen.queryByText("expenses")).toBeNull();
    expect(screen.queryByText("income")).toBeNull();
    expect(screen.queryByText("savings")).toBeNull();

    await user.click(buttonEl);

    expect(screen.getByText("expenses")).toBeInTheDocument();
    expect(screen.getByText("income")).toBeInTheDocument();
    expect(screen.getByText("savings")).toBeInTheDocument();
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
    const optionButtonEl = screen.getByRole("button", { name: "savings" });
    await user.click(optionButtonEl);

    expect(setStateFunc).toHaveBeenCalledWith("savings");
  });
  it("given a alue the input value changes", () => {
    render(<DropdownWithAutoComplete placeholder={"Type"} state={"savings"} />);
    const inputEl = screen.getByPlaceholderText("Type");
    expect(inputEl).toHaveValue("savings");
  });
});
