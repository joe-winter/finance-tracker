import { Request, Response } from "express-serve-static-core";
import User from "../models/user";
import { generateToken } from "../lib/token";
import TransactionModel from "../models/transaction";

interface AuthenticatedRequest extends Request {
  user_id?: string;
}
interface TotalsRequest extends AuthenticatedRequest {
  query: {
    startDate: string;
    endDate: string;
  };
}
interface CategoryTotal {
  name: string;
  total: number;
}

interface Totals {
  expenses: { total: number; categories: { [category: string]: number } };
  income: { total: number; categories: { [category: string]: number } };
  savings: { total: number; categories: { [category: string]: number } };
}

export default class DataController {
  public static async totals(
    req: TotalsRequest,
    res: Response<{ token?: String; totals: Totals }>
  ) {
    if (req.user_id) {
      let transactions;
      if (req.query.startDate && req.query.endDate) {
        transactions = await TransactionModel.find({
          user: req.user_id,
          date: {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate),
          },
        });
      } else {
        transactions = await TransactionModel.find({ user: req.user_id });
      }

      const totals: Totals = {
        expenses: {
          total: 0,
          categories: {},
        },
        income: {
          total: 0,
          categories: {},
        },
        savings: {
          total: 0,
          categories: {},
        },
      };

      transactions.forEach((transaction) => {
        const type = transaction.type as keyof Totals;
        totals[type].total += transaction.amount;

        if (transaction.category in totals[type]) {
          totals[type].categories[transaction.category] =
            Math.round(
              (totals[type].categories[transaction.category] +
                transaction.amount) *
                100
            ) / 100;
        } else {
          totals[type].categories[transaction.category] = transaction.amount;
        }
      });
      const newToken = generateToken(req.user_id);
      res.status(200).json({ totals: totals, token: newToken });
    }
  }
}
