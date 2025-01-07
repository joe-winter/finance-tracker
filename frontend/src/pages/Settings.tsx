import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import NavBarSwitcher from "../components/NavBarSwitcher";
import { UserService } from "@/services/user";

interface SettingsProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
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
interface Categories {
  expenses: string[];
  income: string[];
  savings: string[];
};

export default function Settings({ isOpen, setIsOpen }: SettingsProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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
  const [newExpense, setNewExpense] = useState("");
  const [newIncome, setNewIncome] = useState("");
  const [newSaving, setNewSaving] = useState("");
  const [updatedCategories, setUpdatedCategories] = useState<Categories>({
    expenses: [],
    income: [],
    savings: [],
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const updatedCategories = { ...user.categories };
    updatedCategories.expenses.push(newExpense)
    setUpdatedCategories(updatedCategories)
    const loggedIn = token !== null;
    try {
      if (loggedIn) {
        await UserService.updateCategories(token, updatedCategories)
      }
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    const fetchData = async () => {
      const loggedIn = token !== null;
      try {
        if (loggedIn) {
          const response = await UserService.getUserData(token);
          localStorage.setItem("token", response.token)
          setUser(response.user);
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate, token, updatedCategories]);
  console.log("user info", user);
  return (
    <>
      <NavBarSwitcher isOpen={isOpen} setIsOpen={setIsOpen} />
      <h2
        className={`flex justify-center text-2xl font-semibold whitespace-nowrap  p-4 ${
          isOpen ? "mt-72" : "mt-16"
        }`}
      >
        Settings
      </h2>
      <div>Email: {user?.email}</div>
      <div>Name: {`${user?.firstName} ${user?.lastName}`}</div>
      <h2>Categories</h2>
      <div>Expenses:</div>
      <div>
        {user.categories?.expenses.map((category, index) => (
          <span key={index}>{category}</span>
        ))}
      </div>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="expenses"></label>
        <input
          type="text"
          name="epenses"
          id="expenses"
          placeholder="Enter expense here"
          value={newExpense}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewExpense(e.target.value)
          }
        />
        <button type="submit">+</button>
      </form>
      <div>Income:</div>
      <div>
        {user.categories?.income.map((category, index) => (
          <span key={index}>{category}</span>
        ))}
      </div>
      <div>Savings:</div>
      <div>
        {user.categories?.savings.map((category, index) => (
          <span key={index}>{category}</span>
        ))}
      </div>
    </>
  );
}
