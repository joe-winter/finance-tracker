import { TransactionsService } from "../services/transactions";
import NavBarSwitcher from "../components/NavBarSwitcher";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionTable from "../components/TransactionTable";
type TransactionProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Transactions({ isOpen, setIsOpen }: TransactionProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [state, setState] = useState(false);
  const [transactions, setTransactions] = useState([
    {
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
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [token, navigate, state]);
  console.log(transactions);
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
            transactions={transactions}
            setState={setState}
            state={state}
          />
      </div>
    </>
  );
}
