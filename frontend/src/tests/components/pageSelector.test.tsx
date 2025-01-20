import PageSelector from "@/components/TransactionTable/PageSelector";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("page selector", () => {
  it("displays given page number", () => {
    render(<PageSelector pageNumber={1} />);

    const pageNumberEl = screen.getByText("1");
    expect(pageNumberEl).toBeInTheDocument();
  });
  it("calls page function with 2 when right chevron is pressed", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<PageSelector pageNumber={1} onPageChange={onPageChange} />);

    const rightButtonEl = screen.getByTestId("chevron-right");

    await user.click(rightButtonEl);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
  it("calls page function with 1 when left chevron is pressed", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<PageSelector pageNumber={2} onPageChange={onPageChange} />);

    const leftButtonEl = screen.getByTestId("chevron-left");

    await user.click(leftButtonEl);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
