import { PageSizeSelector } from "@/components/TransactionTable/PageSizeSelector"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"


describe("page size selector", () => {
  it("displays current page size", () => {
    render(<PageSizeSelector currentPageSize={10}/>) 

    const pageSizeEl = screen.getByText("10")
    expect(pageSizeEl).toBeInTheDocument()
  })
  it("dispalys options when clicking down chevron", async () => {
    const user = userEvent.setup()
    render(<PageSizeSelector currentPageSize={10} options={[10,25,100]}/>) 
  
    const dropdownButtonEl = screen.getByTestId("chevron-down")

    await user.click(dropdownButtonEl)

    const buttonEls = screen.getAllByRole("button")

    expect(buttonEls[1]).toHaveTextContent("10")
    expect(buttonEls[2]).toHaveTextContent("25")
    expect(buttonEls[3]).toHaveTextContent("100")
  })
  it("calls function when options is selected", async () => {
    const user = userEvent.setup()
    const onPageSizeChange = vi.fn()
    render(<PageSizeSelector currentPageSize={10} options={[10,25,100]} onPageSizeChange={onPageSizeChange}/>) 
  
    const dropdownButtonEl = screen.getByTestId("chevron-down")
  
    await user.click(dropdownButtonEl)
  
    const buttonEls = screen.getAllByRole("button")
    expect(buttonEls[2]).toHaveTextContent("25")

    await user.click(buttonEls[2])

    expect(onPageSizeChange).toHaveBeenCalledWith(25)
  })
})