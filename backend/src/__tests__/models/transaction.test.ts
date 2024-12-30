import "../../mongodb_helper";
import Transaction from "../../models/transaction";

describe("Transaction Model", () => {
  beforeEach(async () => {
    await Transaction.deleteMany({});
  });
  it("can save a Transaction", async () => {
    const transaction = new Transaction({
      date: new Date("2024-01-01"),
      type: "savings",
      category: "car",
      amount: 59.99,
      description: "new tire",
      balance: 425.65
    });

    await transaction.save();
    const transactions = await Transaction.find();

    expect(transactions[0].date).toEqual(new Date("2024-01-01"));
    expect(transactions[0].type).toEqual("savings");
    expect(transactions[0].category).toEqual("car");
    expect(transactions[0].amount).toEqual(59.99);
    expect(transactions[0].description).toEqual("new tire");
    expect(transactions[0].balance).toEqual(425.65);
  });
});
