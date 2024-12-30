import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  date: {type: Date},
  type: {type: String},
  category: {type: String},
  amount: {type: Number},
  description: {type: String},
  balance: {type: Number},
})

const Transaction = mongoose.model("Transaction", TransactionSchema)

export default Transaction
