import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarSwitcher from "../components/NavBarSwitcher";
import { DataService } from "@/services/data";
import PieChartTotals from "@/components/PieChartTotals";

type DashboardProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

interface Totals {
  expenses: { total: number; categories: { [category: string]: number } };
  income: { total: number; categories: { [category: string]: number } };
  savings: { total: number; categories: { [category: string]: number } };
}

export default function Dashboard({ isOpen, setIsOpen }: DashboardProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [data, setData] = useState<Totals>({
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
  });

  const COLORSGREEN = ["#006400","#228B22","#2E8B57","#3CB371","#32CD32","#7CFC00","#90EE90",];
  const COLORSBLUE = [
    "#00008B",
    "#0000CD",
    "#1E90FF",
    "#4169E1",
    "#4682B4",
    "#5F9EA0",
    "#87CEEB",
  ];
  

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    const fetchData = async () => {
      const loggedIn = token !== null;
      try {
        if (loggedIn) {
          const response = await DataService.getTotals(token);
          localStorage.setItem("token", response.token);
          setData(response.totals);
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate, token]);

  console.log("Data", data);

  const expensesData = [];

  for (const [key, value] of Object.entries(data.expenses.categories)) {
    expensesData.push({ name: key, value: value });
  }
  expensesData.sort((a, b) => b.value - a.value);

  const incomeData = []

  for (const [key, value] of Object.entries(data.income.categories)) {
    incomeData.push({ name: key, value: value });
  }
  incomeData.sort((a, b) => b.value - a.value);

  console.log("expenses", expensesData);

  return (
    <>
      <NavBarSwitcher isOpen={isOpen} setIsOpen={setIsOpen} />

      <h2
        className={`flex justify-center text-2xl font-semibold whitespace-nowrap  p-4 ${
          isOpen ? "mt-72" : "mt-16"
        }`}
      >
        Dashboard
      </h2>
      <h3>Expenses</h3>
      <PieChartTotals data={expensesData} colors={COLORSGREEN}/>
      <h3>Income</h3>
      <PieChartTotals data={incomeData} colors={COLORSBLUE}/>
    </>
  );
}
