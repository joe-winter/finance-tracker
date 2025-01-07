import { TransactionsService } from "../services/transactions";
import DropdownWithAutoComplete from "./DropdownWithAutoComplete";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

type TransactionTableProps = {
  transactions: {
    date: string;
    type: string;
    category: string;
    amount: number;
    description: string;
    balance: number;
  }[];
  setState: Dispatch<SetStateAction<boolean>>;
  state: boolean;
};

export default function TransactionTable({
  transactions,
  setState,
  state,
}: TransactionTableProps) {
  const [formValue, setFormValue] = useState({
    date: "",
    type: "",
    category: "",
    amount: 0,
    description: "",
  });

  const formData = [
    {
      type: "date",
      id: "date",
      placeholder: "Date",
      value: formValue.date,
    },
    {
      type: "text",
      id: "type",
      placeholder: "Type",
      value: formValue.type,
    },
    {
      type: "text",
      id: "category",
      placeholder: "Category",
      value: formValue.category,
    },
    {
      type: "number",
      id: "amount",
      placeholder: "Amount",
      value: formValue.amount,
    },
    {
      type: "text",
      id: "description",
      placeholder: "Description",
      value: formValue.description,
    },
  ];

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await TransactionsService.add(token, formValue);
        setState(!state);
      }
    } catch (err) {
      console.log(err);
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
              <td>
                <input
                  className="dark:bg-gray-900 border rounded"
                  type={formData[0].type}
                  name={formData[0].id}
                  id={formData[0].id}
                  placeholder={formData[0].placeholder}
                  value={formData[0].value}
                  onChange={handleChange}
                />
              </td>
              <td>
                <DropdownWithAutoComplete placeholder="Type" options={["expenses", "income", "savings"]}/>
              </td>
              <td>
                <input
                  className="dark:bg-gray-900 border rounded"
                  type={formData[2].type}
                  name={formData[2].id}
                  id={formData[2].id}
                  placeholder={formData[2].placeholder}
                  value={formData[2].value}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  className="dark:bg-gray-900 border rounded"
                  type={formData[3].type}
                  name={formData[3].id}
                  id={formData[3].id}
                  placeholder={formData[3].placeholder}
                  value={formData[3].value}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  className="dark:bg-gray-900 border rounded"
                  type={formData[4].type}
                  name={formData[4].id}
                  id={formData[4].id}
                  placeholder={formData[4].placeholder}
                  value={formData[4].value}
                  onChange={handleChange}
                />
              </td>
            <td>
              <button type="submit">Add</button>
            </td>
          </tr>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date.slice(0, 10)}</td>
              <td>
                {transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)}
              </td>
              <td>{transaction.category}</td>
              <td>{transaction.amount.toFixed(2)}</td>
              <td>{transaction.description.slice(0, 18)}</td>
              <td>{transaction.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
}
