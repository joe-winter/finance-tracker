import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

  console.log("Settings", user);
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
      {/* User Profile Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 m-4">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-gray-500 w-24">Email:</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 w-24">Name:</span>
            <span>{`${user?.firstName} ${user?.lastName}`}</span>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 m-4">
        <h2 className="text-xl font-semibold mb-6">Categories</h2>

        {/* Expenses */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Expenses</h3>
          <div className="mb-3">
            <CategoryList
              type="expenses"
              categories={user.categories}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
          <div className="max-w-56">

          <CategoryForm
            type="expenses"
            placeholder="Enter expense categories"
            categories={user.categories}
            refresh={refresh}
            setRefresh={setRefresh}
            />
            </div>
        </div>

        {/* Income */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Income</h3>
          <div className="mb-3">
            <CategoryList
              type="income"
              categories={user.categories}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
          <div className="max-w-56">
            <CategoryForm
              type="income"
              placeholder="Enter income categories"
              categories={user.categories}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
        </div>

        {/* Savings */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Savings</h3>
          <div className="mb-3">
            <CategoryList
              type="savings"
              categories={user.categories}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
          <div className="max-w-56">
            <CategoryForm
              type="savings"
              placeholder="Enter savings categories"
              categories={user.categories}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
        </div>
      </section>
    </>
  );
}
