import { TransactionsService } from "../services/transactions";
import NavBarSwitcher from "../components/NavBarSwitcher";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import { UserService } from "@/services/user";
type TransactionProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
interface User {
  email: string;
  firstName: string;
  lastName: string;
  categories: {
    expenses: string[];
    income: string[];
    savings: string[];
  };
}
type Transaction = {
  _id: string;
  date: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  balance: number;
};

type sortField = "date" | "type" | "category" | "amount" | null;

type sortDirection = "ascending" | "descending" | null;

export default function Transactions({ isOpen, setIsOpen }: TransactionProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [sortField, setSortField] = useState<sortField>(null);
  const [sortDirection, setSortDirection] = useState<sortDirection>(null);
  const [state, setState] = useState(false);
  const [user, setUser] = useState<User>({
    email: "",
    firstName: "",
    lastName: "",
    categories: {
      expenses: [],
      income: [],
      savings: [],
    },
  });
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      _id: "",
      date: "",
      type: "",
      category: "",
      amount: 0,
      description: "",
      balance: 0,
    },
  ]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    const fetchData = async () => {
      const loggedIn = token !== null;
      try {
        if (loggedIn) {
          const transactionsData = await TransactionsService.get(token);
          setTransactions(transactionsData.transactions);
          const userData = await UserService.getUserData(token);
          setUser(userData.user);
          localStorage.setItem("token", userData.token);
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [token, navigate]);

  const sortedTransactions = useMemo(() => {
    if (sortDirection === null) return transactions;
    
    return [...transactions].sort((a, b) => {
      const modifier = sortDirection === "ascending" ? 1 : -1;
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier;
    });
  }, [transactions, sortDirection]);

  const handleSortingChange = (field: sortField) => {
    const direction =
      sortDirection === "ascending" ? "descending" : "ascending";
    setSortField(field);
    setSortDirection(direction);
  };

  return (
    <>
      <NavBarSwitcher isOpen={isOpen} setIsOpen={setIsOpen} />
      <h2
        className={`flex justify-center text-2xl font-semibold whitespace-nowrap p-4 ${
          isOpen ? "mt-72" : "mt-16"
        }`}
      >
        Transactions
      </h2>
      <div className=" overflow-x-auto w-full">
        <TransactionTable
          transactions={sortedTransactions}
          setState={setState}
          state={state}
          categories={user.categories}
          handleSortingChange={handleSortingChange}
        />
      </div>
    </>
  );
}
