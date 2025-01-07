import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarSwitcher from "../components/NavBarSwitcher";
import { UserService } from "@/services/user";

interface SettingsProps {
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
  
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    const fetchData = async () => {
      const loggedIn = token !== null;
      try {
        if (loggedIn) {
          const userData = await UserService.getUserData(token);
          setUser(userData.user)
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate, token]);
  console.log("user info", user)
  return (
    <>
    <NavBarSwitcher isOpen={isOpen} setIsOpen={setIsOpen}/>
      <h2 className={`flex justify-center text-2xl font-semibold whitespace-nowrap  p-4 ${
          isOpen ? "mt-72" : "mt-16"
        }`}>Settings</h2>
        <div>Email: {user?.email}</div>
        <div>Name: {`${user?.firstName} ${user?.lastName}`}</div>
    </>
  );
}
