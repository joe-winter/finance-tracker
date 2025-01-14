import { TransactionsService } from "@/services/transactions";
import DropdownWithAutoComplete from "./DropdownWithAutoComplete";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";

type TransactionTableProps = {
  transactions: {
    _id: string
    date: string;
    type: string;
    category: string;
    amount: number;
    description: string;
    balance: number;
  }[];
  setState: Dispatch<SetStateAction<boolean>>;
  state: boolean;
  categories: Categories;
};

interface Categories {
  expenses: string[];
  income: string[];
  savings: string[];
}

export default function TransactionTable({
  transactions,
  categories,
  state,
  setState
}: TransactionTableProps) {
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await TransactionsService.add(token, {date, type, category, amount, description});
        setState(!state);
      }
    } catch (err) {
      console.log(err);
      navigate("/login")
    }
  }

  const getCategories = (type: string, categories: Categories) => {
    const categoryType = type.toLowerCase() as keyof Categories;
    return categories[categoryType]
  };

  const handleDelete = async (transactionId: string) => {
    const token = localStorage.getItem("token")
    if (token) {
      await TransactionsService.deleteById(token, transactionId)
      setState(!state);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="max-w-fit">
              <input
                className="dark:bg-gray-900 border rounded max-w-30"
                type="date"
                name="date"
                id="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </td > 
            <td className="relative">
              <DropdownWithAutoComplete
                placeholder="Type"
                options={["expenses", "income", "savings"]}
                state={type}
                setStateFunc={setType}
                size={7}
              />
            </td>
            <td className="relative">
              <DropdownWithAutoComplete
                placeholder="Category"
                options={getCategories(type, categories)}
                state={category}
                setStateFunc={setCategory}
                size={10}
              />
            </td>
            <td>
              <input
                className="dark:bg-gray-900 border rounded max-w-24"
                type="number"
                name="amount"
                id="amount"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </td>
            <td>
              <input
                className="dark:bg-gray-900 border rounded"
                type="text"
                name="description"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size={18}
              />
            </td>
            <td>
              <button type="submit">Add</button>
            </td>
          </tr>
          {transactions && transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date.slice(0, 10)}</td>
              <td>
                {transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)}
              </td>
              <td>{transaction.category}</td>
              <td>{transaction.amount.toFixed(2)}</td>
              <td>{transaction.description.slice(0, 18)}</td>
              <td>{transaction?.balance?.toFixed(2)}</td>
              <td><button onClick={() => handleDelete(transaction._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
}
