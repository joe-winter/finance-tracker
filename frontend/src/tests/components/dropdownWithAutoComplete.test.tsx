import DropdownWithAutoComplete from "@/components/DropdownWithAutoComplete";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("drop down with auto complete", () => {
  it("has given placeholder", () => {
    render(<DropdownWithAutoComplete placeholder={"Amount"} />);

    const inputEl = screen.getByPlaceholderText("Amount");
    expect(inputEl).toBeInTheDocument();
  });
  it("has dropdown button", () => {
    render(<DropdownWithAutoComplete placeholder={"Amount"} />);

    const buttonEl = screen.getByTestId("chevron-svg");
    expect(buttonEl).toBeInTheDocument();
  });
  it("given options when a clicks they appear below", async () => {
    const user = userEvent.setup()
    const options = ["expenses", "income", "savings"];
    
    render(
      <DropdownWithAutoComplete placeholder={"Amount"} options={options} />
    );
    
    const buttonEl = screen.getByTestId("chevron-svg");

    expect(screen.queryByText("expenses")).toBeNull()
    expect(screen.queryByText("income")).toBeNull()
    expect(screen.queryByText("savings")).toBeNull()


    await user.click(buttonEl)

    expect(screen.getByText("expenses")).toBeInTheDocument()
    expect(screen.getByText("income")).toBeInTheDocument()
    expect(screen.getByText("savings")).toBeInTheDocument()


  });
});
