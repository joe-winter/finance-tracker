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
import CategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";

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
}

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
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    const fetchData = async () => {
      const loggedIn = token !== null;
      try {
        if (loggedIn) {
          const response = await UserService.getUserData(token);
          localStorage.setItem("token", response.token);
          setUser(response.user);
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate, token, refresh]);
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
      <CategoryList
        type={"expenses"}
        categories={user.categories}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <CategoryForm
        type={"expenses"}
        placeholder={"Enter expense here"}
        categories={user.categories}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <div>Income:</div>
      <CategoryList
        type={"income"}
        categories={user.categories}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <CategoryForm
        type={"income"}
        placeholder={"Enter incomes here"}
        categories={user.categories}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <div>Savings:</div>
      <CategoryList
        type={"savings"}
        categories={user.categories}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <CategoryForm
        type={"savings"}
        placeholder={"Enter savings here"}
        categories={user.categories}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </>
  );
}
