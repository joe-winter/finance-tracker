import { TransactionsService } from "@/services/transactions";
import DynamicFormInput from "./DynamicFormInput";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableHeading from "./TableHeading";
import StringUtils from "@/utils/stringUtils";
type Transaction = {
  _id: string;
  date: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  balance: number;
};
type TransactionTableProps = {
  transactions: Transaction[];
  setState: Dispatch<SetStateAction<boolean>>;
  state: boolean;
  categories: Categories;
  handleSortingChange: (field: string, type: SortType) => void;
};

type TableHeadingOptions = {
  heading: string;
  sortable: boolean;
  type: SortType;
};

type SortType = "date" | "number" | "string" | null;

interface Categories {
  expenses: string[];
  income: string[];
  savings: string[];
}

export default function TransactionTable({
  transactions,
  categories,
  state,
  setState,
  handleSortingChange,
}: TransactionTableProps) {
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

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

  const convertDate = (date: string) => {
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      })
      .toString();
  };

  const getCategories = (type: string, categories: Categories) => {
    const categoryType = type.toLowerCase() as keyof Categories;
    return categories[categoryType];
  };

  const handleDelete = async (transactionId: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      await TransactionsService.deleteById(token, transactionId);
      setState(!state);
    }
  };

  const tableHeadings: TableHeadingOptions[] = [
    {
      heading: "date",
      sortable: true,
      type: "date",
    },
    {
      heading: "type",
      sortable: true,
      type: "string",
    },
    {
      heading: "category",
      sortable: true,
      type: "string",
    },
    {
      heading: "amount",
      sortable: true,
      type: "number",
    },
    {
      heading: "description",
      sortable: false,
      type: null,
    },
    {
      heading: "balance",
      sortable: false,
      type: null,
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <table className="table-auto">
        <thead>
          <tr>
            {tableHeadings.map((heading, index) => (
              <th key={index}>
                <TableHeading
                  heading={heading.heading}
                  type={heading.type ? heading.type : null}
                  handleSortingChange={
                    heading.sortable ? handleSortingChange : undefined
                  }
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                className="dark:bg-gray-700 bg-gray-50 border rounded h-7 dark:border-gray-600"
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
                value={type}
                onChange={setType}
                size={7}
              />
            </td>
            <td className="relative">
              <DynamicFormInput
                placeholder="Category"
                choices={getCategories(type, categories)}
                value={category}
                onChange={setCategory}
                size={12}
              />
            </td>
            <td>
              <input
                className="dark:bg-gray-700 bg-gray-50 rounded max-w-24 border dark:border-gray-600 h-7 flex items-center px-1"
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
                className="dark:bg-gray-700 bg-gray-50 rounded border h-7 dark:border-gray-600 flex items-center px-1"
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
              <button
                className="dark:bg-gray-700 bg-blue-50 w-16 rounded border h-7  dark:border-gray-600 flex items-center justify-center"
                type="submit"
              >
                Add
              </button>
            </td>
          </tr>
          {transactions &&
            transactions.map((transaction, index) => (
              <tr key={index} className="border-b dark:border-gray-600">
                <td className="p-1">{convertDate(transaction.date)}</td>
                <td>{StringUtils.capitalise(transaction.type)}</td>
                <td>{StringUtils.capitalise(transaction.category)}</td>
                <td>£{transaction.amount.toFixed(2)}</td>
                <td>
                  <td>
                    <div className="overflow-clip w-36 whitespace-nowrap hover:overflow-x-scroll hover:w-36">
                      {transaction.description}
                    </div>
                  </td>
                </td>
                <td>£{transaction?.balance?.toFixed(2)}</td>
                <td>
                  <button
                    className="flex"
                    type="button"
                    onClick={() => handleDelete(transaction._id)}
                  >
                    <svg
                      className="w-4 h-4 text-red-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18 17.94 6M18 18 6.06 6"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </form>
  );
}
