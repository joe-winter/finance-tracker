import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"

function App() {
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
      element: <Dashboard/>
    }
  ])

  return (
    <>
    <RouterProvider router={router}/></>
  )
}

export default App
