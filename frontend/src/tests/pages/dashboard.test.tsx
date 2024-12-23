import { useNavigate } from "react-router-dom";
import Dashboard from "../../pages/Dashboard"
import { render } from "@testing-library/react"

vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, useParams: vi.fn() };
});

describe("Dashboard Page", () => {
  it("should navigate to login if no token is present", () => {
    render(<Dashboard/>)

    const navigateMock = useNavigate()

    expect(navigateMock).toHaveBeenCalledWith("/login")

  })
})
