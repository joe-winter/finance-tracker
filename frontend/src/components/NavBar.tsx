import { useNavigate } from "react-router-dom";
import ToggleTheme from "./ToggleTheme";

export default function NavBar() {
  const navigate = useNavigate()
  return (
    <nav className="bg-gray-50 border-gray-200 dark:bg-gray-900 shadow-lg fixed w-full top-0 z-50">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <button onClick={() => navigate("/dashboard")}>
        <div className="flex items-center space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Joe Winter
          </span>
        </div>
      </button>
      <div className="block w-auto">
        <ul className="font-medium flex p-0 flex-row space-x-8 mt-0 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
          <li>
            <button onClick={() => navigate("/transactions")}>
              <div className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 dark:hover:bg-transparent">
                Transactions
              </div>
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/dashboard")}>
              <div className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 dark:hover:bg-transparent">
                Dashboard
              </div>
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/settings")}>
              <div className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 dark:hover:bg-transparent">
                Settings
              </div>
            </button>
          </li>
          <li>
            <ToggleTheme />
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}