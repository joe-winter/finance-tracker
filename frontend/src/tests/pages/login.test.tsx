import { describe, expect, it } from "vitest";
import {render, screen} from "@testing-library/react"
import Login from "../../pages/Login";
import '@testing-library/jest-dom'

describe("Login Page", () => {
  it("should render heading", () => {
    render(<Login/>)

    const headingEl = screen.getByRole("heading", {name: "Login"})

    expect(headingEl).toBeInTheDocument()
  })

  it("should have a login form", () => {
    render(<Login/>)
  })
})