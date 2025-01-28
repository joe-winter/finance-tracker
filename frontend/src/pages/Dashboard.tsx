import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarSwitcher from "../components/NavBarSwitcher";
import { DataService } from "@/services/data";
import PieChartTotals from "@/components/PieChartTotals";
import StringUtils from "@/utils/stringUtils";
import Dropdown from "@/components/Dropdown";
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

  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("January");
  const months = [
    "All Year",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let startDate: string = "";
  let endDate: string = "";

  if (month !== "All Year") {
    startDate = new Date(Number(year), months.indexOf(month) - 1, 1).toString();
    endDate = new Date(Number(year), months.indexOf(month), 1).toString();
  } else {
    startDate = new Date(Number(year), 0, 1).toString();
    endDate = new Date(Number(year), 12, 1).toString();
  }

  const COLORSGREEN = [
    "#006400",
    "#228B22",
    "#2E8B57",
    "#3CB371",
    "#32CD32",
    "#7CFC00",
    "#90EE90",
  ];
  const COLORSBLUE = [
    "#00008B",
    "#0000CD",
    "#1E90FF",
    "#4169E1",
    "#4682B4",
    "#5F9EA0",
    "#87CEEB",
  ];
  const COLORSRED = [
    "#8B0000",
    "#B22222",
    "#DC143C",
    "#FF0000",
    "#FF6347",
    "#FF7F7F",
    "#FFA07A",
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    const fetchData = async () => {
      const loggedIn = token !== null;
      try {
        if (loggedIn) {
          const response = await DataService.getTotals(
            token,
            startDate,
            endDate
          );
          localStorage.setItem("token", response.token);
          setData(response.totals);
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [endDate, navigate, startDate, token]);

  const processCategoryTotals = (expenseData: { [key: string]: number }) => {
    const formattedCategories = [];
  
    // Capitalise category names and push them with their values
    for (const [categoryName, categoryValue] of Object.entries(expenseData)) {
      formattedCategories.push({
        name: StringUtils.capitalise(categoryName),
        value: categoryValue,
      });
    }
  
    // Sort categories by value in descending order
    formattedCategories.sort((a, b) => b.value - a.value);
  
    // Sum the values of categories beyond the top 6
    const sumOfRemainingCategories = formattedCategories
      .slice(5)
      .reduce((total, category) => total + category.value, 0);
  
    // Extract the top 6 categories
    const topCategories = formattedCategories.slice(0, 5);
  
    // Add the "Other" category if there are remaining values
    if (sumOfRemainingCategories > 0) {
      topCategories.push({ name: "Other", value: sumOfRemainingCategories });
    }
  
    return topCategories;
  };

  
  const expensesData = processCategoryTotals(data.expenses.categories);
  const incomeData = processCategoryTotals(data.income.categories);
  const savingsData = processCategoryTotals(data.savings.categories);


  return (
    <>
      <NavBarSwitcher isOpen={isOpen} setIsOpen={setIsOpen} />

      <h2
        className={`flex justify-center text-2xl font-semibold pt-4 ${
          isOpen ? "mt-72" : "mt-16"
        }`}
      >
        Dashboard
      </h2>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 m-4 flex">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center flex-grow">
            <span className="p-2 font-medium">Year:</span>
            <Dropdown
              value={year}
              setValue={setYear}
              options={["2020", "2021", "2022", "2023", "2024", "2025"]}
              size="w-full"
            />
          </div>
          <div className="flex items-center flex-grow">
            <span className="p-2 font-medium">Month:</span>
            <Dropdown
              value={month}
              setValue={setMonth}
              options={months}
              size="w-full"
            />
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 m-4 overflow-auto">
        <h3 className="font-semibold text-xl">Expenses</h3>
        <PieChartTotals
          data={expensesData}
          colors={COLORSGREEN}
          total={data.expenses.total}
        />
      </section>
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 m-4 overflow-auto">
        <h3 className="font-semibold text-xl">Income</h3>
        <PieChartTotals
          data={incomeData}
          colors={COLORSBLUE}
          total={data.income.total}
        />
      </section>
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 m-4 overflow-auto">
        <h3 className="font-semibold text-xl">Savings</h3>
        <PieChartTotals
          data={savingsData}
          colors={COLORSRED}
          total={data.savings.total}
        />
      </section>
    </>
  );
}
