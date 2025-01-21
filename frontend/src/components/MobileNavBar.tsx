import { Dispatch, SetStateAction } from "react";
import ToggleTheme from "./ToggleTheme";
import ToggleMobileMenu from "./ToggleMobileMenu";
import { useNavigate } from "react-router-dom";

type MobileNavBarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MobileNavBar({ isOpen, setIsOpen }: MobileNavBarProps) {
  const navigate = useNavigate()

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 769);
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const handleNavigate = (path:string) => {
    navigate(path)
    setIsOpen(false)
  }
  return (
    <div className="h-full">
      <nav
        className={`bg-gray-50 border-gray-200 dark:bg-gray-900 shadow-lg fixed w-full top-0 z-50`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <button>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Your Finance Tracker
              </span>
            </div>
          </button>
          <ul className="font-medium flex p-0 flex-row space-x-8 mt-0 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 items-center">
            <li>
              <ToggleTheme />
            </li>
            <li>
              <button onClick={() => setIsOpen(!isOpen)}>
                <ToggleMobileMenu isOpen={isOpen} />
              </button>
            </li>
          </ul>
          <div className="w-full md:block md:w-auto">
            {isOpen && (
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <button onClick={() => handleNavigate("/transactions")}>
                    <div className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                      Transactions
                    </div>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("/dashboard")}>
                    <div className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                      Dashboard
                    </div>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("/settings")}>
                    <div className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                      Settings
                    </div>
                  </button>
                </li>
                <li>
                  <button onClick={handleLogOut}>
                    <div className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                      Log Out
                    </div>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
