import { useNavigate } from "react-router-dom";
import { render } from "@testing-library/react"
import Transactions from "../../pages/Transactions";
import { TransactionsService } from "../../services/transactions";

vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, useParams: vi.fn() };
});

vi.mock("../../services/transactions.ts", () => ({
  TransactionsService: {
    get: vi.fn(),
    add: vi.fn()
  }
}
))

describe("Transactions Page", () => {
  it("should navigate to login if no token is present", () => {
    render(<Transactions/>)

    const navigateMock = useNavigate()
    expect(navigateMock).toHaveBeenCalledWith("/login")
  })
  it("should call get friends service when page is loading", () => {
    window.localStorage.setItem("token", "testToken")

    render(<Transactions/>)

    expect(TransactionsService.get).toHaveBeenCalledWith("testToken")
  })
})
