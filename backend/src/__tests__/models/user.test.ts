import "../../mongodb_helper"
import User from "../../models/user"

describe("User Model", () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  it("has an email", () => {
    const user = new User({
      email: "someone@example.com"
    })
    expect(user.email).toEqual("someone@example.com")
  })
})