import { useNavigate } from "react-router-dom";
import DynamicFormInput from "./DynamicFormInput";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { TransactionsService } from "@/services/transactions";

interface Categories {
  expenses: string[];
  income: string[];
  savings: string[];
}

type TransactionFormProps = {
  setState: Dispatch<SetStateAction<boolean>>;
  state: boolean;
  categories: Categories;
};

export default function TableForm({
  state,
  setState,
  categories,
}: TransactionFormProps) {
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const getCategories = (type: string, categories: Categories) => {
    const categoryType = type.toLowerCase() as keyof Categories;
    return categories[categoryType];
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await TransactionsService.add(token, {
          date,
          type,
          category,
          amount,
          description,
        });
        setState(!state);
      }
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <table>
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
            </td>
            <td className="relative">
              <DynamicFormInput
                placeholder="Type"
                choices={["expenses", "income", "savings"]}
                state={type}
                setStateFunc={setType}
                size={7}
              />
            </td>
            <td className="relative">
              <DynamicFormInput
                placeholder="Category"
                choices={getCategories(type, categories)}
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
        </tbody>
      </table>
    </form>
  );
}
