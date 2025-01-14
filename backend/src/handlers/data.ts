import { Request, Response } from "express-serve-static-core";
import User from "../models/user";
import { generateToken } from "../lib/token";
import TransactionModel from "../models/transaction";

interface AuthenticatedRequest extends Request {
  user_id?: string;
}
interface UserCategoriesRequest extends AuthenticatedRequest {
  body: {
    expenses: string[];
    income: string[];
    savings: string[];
  };
}

interface Totals {
  expenses: {total: number; [category: string]: number};
  income: {total: number; [category: string]: number};
  savings: {total: number; [category: string]: number};

}


export default class DataController {
  public static async totals(
    req: AuthenticatedRequest,
    res: Response<{ token?: String; totals: Totals }>
  ) {
    if (req.user_id) {
      const transactions = await TransactionModel.find({user: req.user_id})

      const totals: Totals = {
        expenses: {total: 0},
        income: {total: 0},
        savings: {total: 0},
      }

      transactions.forEach((transaction) => {
        const type = transaction.type as keyof Totals
        totals[type].total += transaction.amount

        if ((transaction.category in totals[type])) {
          totals[type][transaction.category] = Math.round((totals[type][transaction.category] + transaction.amount) * 100) /100
        } else {
          totals[type][transaction.category] = Math.round(transaction.amount * 100) /100
        }
      })

      console.log(totals)






      const newToken = generateToken(req.user_id);
      res.status(200).json({ totals: totals, token: newToken });
    }
  }
}
