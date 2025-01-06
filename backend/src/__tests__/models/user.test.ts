import "../../mongodb_helper";
import User from "../../models/user";

describe("User Model", () => {
  beforeEach(async () => {
    await User.deleteMany({}).exec();
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
      firstName: "Joe",
    });
    expect(user.firstName).toEqual("Joe");
  });
  it("has a lastname", () => {
    const user = new User({
      lastName: "Winter",
    });
    expect(user.lastName).toEqual("Winter");
  });
  it("has no categories for each type", () => {
    const user = new User({
      categories: {
        expenses: [],
        income: [],
        savings: [],
      },
    });
    expect(user.categories).toMatchObject({
      expenses: [],
      income: [],
      savings: [],
    });
  });
  it("has categories for each type", () => {
    const user = new User({
      categories: {
        expenses: ["rent", "groceries"],
        income: ["salary", "bonus"],
        savings: ["emergency fund", "retirement"],
      },
    });
    expect(user.categories).toMatchObject({
      expenses: ["rent", "groceries"],
      income: ["salary", "bonus"],
      savings: ["emergency fund", "retirement"],
    });
  });
  it("can list all users", async () => {
    const users = await User.find({});
    expect(users).toEqual([]);
  });
  it("can save a user", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password123",
      firstName: "joe",
      lastName: "winter",
      categories: {
        expenses: ["rent", "groceries"],
        income: ["salary", "bonus"],
        savings: ["emergency fund", "retirement"],
      },
    });

    await user.save();
    const users = await User.find({});

    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password123");
    expect(users[0].categories).toMatchObject({
      expenses: ["rent", "groceries"],
      income: ["salary", "bonus"],
      savings: ["emergency fund", "retirement"],
    })
  });
});
