import { Schema, Types, model, Model } from "mongoose";

interface User {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ITransaction {
  date: Date;
  type: string;
  category: string;
  amount: number;
  description: string;
  balance: number;
  user: User;
}

type TransactionModelType = Model<User>;

const transactionSchema = new Schema<ITransaction, TransactionModelType>({
  date: { type: Date },
  type: { type: String },
  category: { type: String },
  amount: { type: Number },
  description: { type: String },
  balance: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const TransactionModel = model("Transaction", transactionSchema);

export default TransactionModel;
