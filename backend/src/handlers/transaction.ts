import { Request, Response } from "express-serve-static-core";
import TransactionModel from "../models/transaction";
import { generateToken } from "../lib/token";
import User from "../models/user";
import { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
  user_id?: string;
}
interface TransactionRequest extends AuthenticatedRequest {
  body: {
    date: string;
    type: string;
    category: string;
    amount: string;
    description: string;
  };
}
type Transaction = {
  _id: Types.ObjectId
  date: Date;
  type: String;
  category: string;
  amount: number;
  description: string;
  balance: number;
};

export default class TransactionsController {
  public static async create(
    req: TransactionRequest,
    res: Response<{ token?: String; message: String }>
  ) {
    const { date, type, category, amount, description } = req.body;
    // save new transaction
    const transaction = new TransactionModel({
      date: new Date(date),
      type: type.toLowerCase(),
      category: category.toLowerCase(),
      amount: Number(amount),
      description,
      user: req.user_id,
    });

    await transaction.save();

    const currentUser = await User.findById(req.user_id);

    if (currentUser) {
      await TransactionsController.updateBalances(req.user_id || "");

      console.log(
        `User ID: ${req.user_id} created Transaction ${req.body.description}`
      );
    }

    if (req.user_id) {
      const newToken = generateToken(req.user_id);
      res.status(201).json({ message: "transaction created", token: newToken });
    }
  }

  private static async updateBalances(userId: string) {
    const transactions = await TransactionModel.find({ user: userId }).sort({
      date: 1,
    });

    const dailyTotals = new Map<string, number>();
    const dailyBalance = new Map<string, number>();

    transactions.forEach((transaction) => {
      const amount =
        transaction.type === "expenses"
          ? -transaction.amount
          : transaction.amount;
      const balance = dailyTotals.get(transaction.date.toString()) || 0;
      dailyTotals.set(transaction.date.toString(), balance + amount);
    });

    let previousBalance = 0;
    dailyTotals.forEach((amount, date) => {
      previousBalance += amount;
      dailyBalance.set(date, previousBalance);
    });

    // must user a for loop when dealing with asynchronous code
    for (const transaction of transactions) {
      transaction.balance = dailyBalance.get(transaction.date.toString()) || 0;
      await transaction.save();
    }
  }

  public static async getByUser(
    req: AuthenticatedRequest,
    res: Response<{ transactions: Transaction[]; token: string }>
  ) {
    try {
      if (req.user_id) {
        const token = generateToken(req.user_id);
        const transactionsQuery = await TransactionModel.find({
          user: req.user_id,
        }).exec();

        const transactionsResponse: Transaction[] = transactionsQuery.map(
          (transaction) => ({
            _id: transaction._id,
            date: transaction.date,
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
            balance: transaction.balance,
          })
        );

        res
          .status(200)
          .json({ transactions: transactionsResponse, token: token });
      }
    } catch (err) {}
  }

  public static async deleteById(
    req: AuthenticatedRequest,
    res: Response<{ token?: String; message: String }>
  ) {
    if (req.user_id) {
      const token = generateToken(req.user_id);
      const transactionId = req.params.id;
      console.log("params", transactionId);

      await TransactionModel.deleteOne({ _id: transactionId });
      res.status(200).json({ message: "deleted", token: token });
    }
  }
}
