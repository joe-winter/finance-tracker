import TableHeading from "@/components/TransactionTable/TableHeading";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("table heading", () => {
  it("should display given heading", () => {
    render(<TableHeading heading="date" />);

    const headingEl = screen.getByRole("heading");

    expect(headingEl).toHaveTextContent("Date");
  });
  it("has sort button", () => {
    const handleSortingChange = vi.fn();
    render(
      <TableHeading heading="date" handleSortingChange={handleSortingChange} />
    );

    const buttonEl = screen.getByTestId("sort-svg");

    expect(buttonEl).toBeInTheDocument();
  });
  it("call sort ascending function when button is clicked", async () => {
    const user = userEvent.setup();

    const handleSortingChange = vi.fn();
    render(
      <TableHeading heading="date" handleSortingChange={handleSortingChange} />
    );

    const buttonEl = screen.getByTestId("sort-svg");

    await user.click(buttonEl);

    expect(handleSortingChange).toHaveBeenCalledWith("date");
  });
  it("calls ascending and then dececing function after click button", async () => {
    const user = userEvent.setup();

    const handleSortingChange = vi.fn();
    render(
      <TableHeading heading="date" handleSortingChange={handleSortingChange} />
    );

    const buttonEl = screen.getByTestId("sort-svg");

    await user.click(buttonEl);

    expect(handleSortingChange).toHaveBeenCalledOnce();

    await user.click(buttonEl);

    expect(handleSortingChange).toHaveBeenCalledTimes(2);
  });
  it("doesnt short sort svg if no function is given", async () => {
    render(<TableHeading heading={"type"} />);

    const buttonEl = screen.queryByRole("button");

    expect(buttonEl).toBeNull();
  });
});
