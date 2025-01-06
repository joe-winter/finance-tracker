import { Request, Response } from "express-serve-static-core";
import TransactionModel from "../models/transaction";
import { generateToken } from "../lib/token";

interface AuthenticatedRequest extends Request {
  user_id?: string;
}
interface TransactionRequest extends AuthenticatedRequest {
  body: 
    {
      date: string;
      type: string;
      category: string;
      amount: string;
      description: string;
    };

}
type TransactionResponse = {
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
    console.log(req.body)
    const { date, type, category, amount, description } =
      req.body;

    const transaction = new TransactionModel({
      date: new Date(date),
      type,
      category,
      amount: Number(amount),
      description,
      user: req.user_id,
      balance: 200
    });

    await transaction.save();

    console.log(
      `User ID: ${req.user_id} created Transaction ${req.body.description}`
    );

    if (req.user_id) {
      const newToken = generateToken(req.user_id);
      res.status(201).json({ message: "transaction created", token: newToken });
    }
  }

  public static async getByUser(
    req: AuthenticatedRequest,
    res: Response<{ transactions: TransactionResponse[]; token: string }>
  ) {
    try {
      if (req.user_id) {
        const token = generateToken(req.user_id);
        const transactionsQuery = await TransactionModel.find({
          user: req.user_id,
        }).exec();

        const transactionsResponse: TransactionResponse[] =
          transactionsQuery.map((transaction) => ({
            date: transaction.date,
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
            balance: transaction.balance,
          }));

        res
          .status(200)
          .json({ transactions: transactionsResponse, token: token });
      }
    } catch (err) {}
  }
}
