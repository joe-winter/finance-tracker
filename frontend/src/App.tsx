import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import { useState } from "react";

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

function App() {
  const [isOpen, setIsOpen] = useState(false);
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
  const handleUserChange = (user: User) => {
    setUser(user)
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "signup",
      element: <SignUp />,
    },
    {
      path: "dashboard",
      element: <Dashboard isOpen={isOpen} setIsOpen={setIsOpen} />,
    },
    {
      path: "transactions",
      element: <Transactions isOpen={isOpen} setIsOpen={setIsOpen} />,
    },
    {
      path: "settings",
      element: (
        <Settings
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
          handleUserChange={handleUserChange}
        />
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
