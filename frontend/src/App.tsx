import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"

function App() {
  const router = createBrowserRouter([
    {
      path: "login",
      element: <Login/>
    },
    {
      path: "signup",
      element: <SignUp/>
    }
  ])

  return (
    <>
    <RouterProvider router={router}/></>
  )
}

export default App
