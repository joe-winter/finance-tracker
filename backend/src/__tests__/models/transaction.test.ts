import "../../mongodb_helper";
import TransactionModel from "../../models/transaction";
import User from "../../models/user";
describe("Transaction Model", () => {
  beforeEach(async () => {
    await TransactionModel.deleteMany({});
  });
  afterEach(async () => {
    await TransactionModel.deleteMany({});
    await User.deleteMany({});
  });
  it("can save a Transaction", async () => {
    const transaction = new TransactionModel({
      date: new Date("2024-01-01"),
      type: "savings",
      category: "car",
      amount: 59.99,
      description: "new tire",
      balance: 425.65,
    });

    await transaction.save();
    const transactions = await TransactionModel.find();

    expect(transactions[0].date).toEqual(new Date("2024-01-01"));
    expect(transactions[0].type).toEqual("savings");
    expect(transactions[0].category).toEqual("car");
    expect(transactions[0].amount).toEqual(59.99);
    expect(transactions[0].description).toEqual("new tire");
    expect(transactions[0].balance).toEqual(425.65);
  });
  it("saves a transaction with user object linked", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password123",
      firstName: "chris",
      lastName: "marion",
    });
    await user.save();

    const transaction = new TransactionModel({
      date: new Date("2024-01-01"),
      type: "expenses",
      category: "car",
      amount: 59.99,
      description: "new tire",
      balance: 425.65,
      user: user._id,
    });
    await transaction.save()

    const transactionDocument = await TransactionModel.find().populate("user");

    expect(transactionDocument[0].type).toEqual("expenses")
    expect(transactionDocument[0].user.email).toEqual("someone@example.com")
  });
});
