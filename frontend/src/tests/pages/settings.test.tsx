import { useNavigate } from "react-router-dom";
import { render } from "@testing-library/react"
import Settings from "../../pages/Settings";

vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, useParams: vi.fn() };
});

describe("Settings Page", () => {
  it("should navigate to login if no token is present", () => {
    render(<Settings/>)

    const navigateMock = useNavigate()
    expect(navigateMock).toHaveBeenCalledWith("/login")
  })
})
