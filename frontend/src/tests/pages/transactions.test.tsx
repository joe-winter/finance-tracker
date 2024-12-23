import { useNavigate } from "react-router-dom";
import { render } from "@testing-library/react"
import Transactions from "../../pages/Transactions";

vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, useParams: vi.fn() };
});

describe("Transactions Page", () => {
  it("should navigate to login if no token is present", () => {
    render(<Transactions/>)

    const navigateMock = useNavigate()
    expect(navigateMock).toHaveBeenCalledWith("/login")
  })
})
