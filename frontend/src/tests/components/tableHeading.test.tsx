import TableHeading from "@/components/TableHeading";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("table heading", () => {
  it("should display given heading", () => {
    render(<TableHeading heading="Date" />);

    const headingEl = screen.getByRole("heading");

    expect(headingEl).toHaveTextContent("Date");
  });
  it("has sort button", () => {
    render(<TableHeading />);

    const buttonEl = screen.getByTestId("sort-svg");

    expect(buttonEl).toBeInTheDocument();
  });
  it("call sort ascending function when button is clicked", async () => {
    const user = userEvent.setup();

    const ascendingFunction = vi.fn();
    render(<TableHeading ascendingFunction={ascendingFunction} />);

    const buttonEl = screen.getByTestId("sort-svg");

    await user.click(buttonEl);

    expect(ascendingFunction).toHaveBeenCalledOnce();
  });
  it("calls ascending and then dececing function after click button", async () => {
    const user = userEvent.setup();

    const ascendingFunction = vi.fn();
    const descendingFunction = vi.fn();
    render(
      <TableHeading
        ascendingFunction={ascendingFunction}
        decendingFunction={descendingFunction}
      />
    );

    const buttonEl = screen.getByTestId("sort-svg");

    await user.click(buttonEl);

    expect(ascendingFunction).toHaveBeenCalledOnce();
    expect(descendingFunction).not.toHaveBeenCalled();

    await user.click(buttonEl);

    expect(ascendingFunction).toHaveBeenCalledOnce();
    expect(descendingFunction).toHaveBeenCalledOnce();
  });
});
