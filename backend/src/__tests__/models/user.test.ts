import "../../mongodb_helper";
import User from "../../models/user";

describe("User Model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("has an email", () => {
    const user = new User({
      email: "someone@example.com",
    });
    expect(user.email).toEqual("someone@example.com");
  });
  it("has a password", () => {
    const user = new User({
      password: "password123",
    });
    expect(user.password).toEqual("password123");
  });
  it("has a firstname", () => {
    const user = new User({
      firstname: "Joe",
    });
    expect(user.firstname).toEqual("Joe");
  });
  it("has a lastname", () => {
    const user = new User({
      lastname: "Winter",
    });
    expect(user.lastname).toEqual("Winter");
  });
  it("can list all users", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });
  it("can save a user", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password123",
      firstName: "chris",
      lastName: "marion",
    });

    await user.save();
    const users = await User.find();

    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password123");
  });
});
