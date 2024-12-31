import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Settings from "./pages/Settings"
import { useState } from "react"

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
    },
    {
      path: "login",
      element: <Login/>
    },
    {
      path: "signup",
      element: <SignUp/>
    },
    {
      path: "dashboard",
      element: <Dashboard isOpen={isOpen} setIsOpen={setIsOpen}/>
    },
    {
      path: "transactions",
      element: <Transactions isOpen={isOpen} setIsOpen={setIsOpen}/>
    },
    {
      path: "settings",
      element: <Settings isOpen={isOpen} setIsOpen={setIsOpen}/>
    }
  ])

  return (
    <>
    <RouterProvider router={router}/></>
  )
}

export default App
