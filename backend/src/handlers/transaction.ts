import { Request, Response } from "express-serve-static-core";
import Transaction from "../models/transaction";
import { generateToken } from "../lib/token";

interface CustomRequest extends Request {
  user_id?: string;
  body: {
    date: string; 
    type: String;
    category: String;
    amount: String;
    description: String;
    balance: String;
  }
}
export default class TransactionsController {
  public static async createTransaction(
    req: CustomRequest,
    res : Response< {token?: String, message: String}>
  ) {
    const { date, type, category, amount, description, balance } = req.body

    const transaction = new Transaction({
      date: new Date(date),
      type,
      category,
      amount: Number(amount),
      description,
      balance: Number(balance),
      user: req.user_id
    })

    await transaction.save()

    console.log(`User ID: ${req.user_id} created Transaction ${req.body.description}`)

    if (req.user_id) {
      const newToken = generateToken(req.user_id)
      res.status(201).json({ message: "transaction created", token: newToken})
    }
    
  }
}
