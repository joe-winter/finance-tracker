import { describe, expect, it } from "vitest";
import {render, screen} from "@testing-library/react"
import Login from "../../pages/Login";
import '@testing-library/jest-dom'

describe("Login Form Component", () => {


  it("should input fields", () => {
    render(<Login/>)

    const emailInputEl = screen.getByLabelText("Your Email")
    expect(emailInputEl).toBeInTheDocument()

    const passwordInputEl = screen.getByLabelText("Password")
    expect(passwordInputEl).toBeInTheDocument()

  })
})