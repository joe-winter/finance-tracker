import { TransactionsService } from "../services/transactions";
import NavBarSwitcher from "../components/NavBarSwitcher";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import { UserService } from "@/services/user";
import PageSelector from "@/components/TransactionTable/PageSelector";
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

interface SortOptions {
  field: string | null;
  direction: SortDirection;
  type: SortType;
}

type SortType = "date" | "number" | "string" | null;
type SortDirection = "ascending" | "descending" | null;

export default function Transactions({ isOpen, setIsOpen }: TransactionProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: null,
    direction: null,
    type: null,
  });
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
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const maxPage = Math.ceil(transactions.length / itemsPerPage)
  console.log(maxPage)

  const handlePageChange = (newPageNumber: number) => {
    if (newPageNumber > 0 && newPageNumber <= maxPage) {
      setCurrentPageNumber(newPageNumber)
    } 
  }

  
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
  }, [token, navigate, state]);
  
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const modifier = sortOptions.direction === "ascending" ? 1 : -1;
      if (sortOptions.field === "date") {
        return (
          (new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier
        );
      }
      if (sortOptions.type === "string") {
        const field = sortOptions.field as keyof Transaction;
        if (typeof a[field] === "string" && typeof b[field] === "string")
          return a[field].localeCompare(b[field]) * modifier;
      }
      if (sortOptions.type === "number") {
        const field = sortOptions.field as keyof Transaction;
        if (typeof a[field] === "number" && typeof b[field] === "number")
          return (a[field] - b[field]) * modifier;
      }
      return 0;
    });
  }, [sortOptions, transactions]);
  
  const dataToDisplay = useMemo(() => {
    const start = (currentPageNumber - 1) * 10
    const end = currentPageNumber * 10
    return sortedTransactions.slice(start, end)
  }, [currentPageNumber, sortedTransactions])


  const handleSortingChange = (field: string, type: SortType) => {
    const direction =
    sortOptions.direction === "ascending" ? "descending" : "ascending";
    setSortOptions({ field, direction, type });
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
          transactions={dataToDisplay}
          setState={setState}
          state={state}
          categories={user.categories}
          handleSortingChange={handleSortingChange}
        />
        <PageSelector pageNumber={currentPageNumber} onPageChange={handlePageChange}/>
      </div>
    </>
  );
}
