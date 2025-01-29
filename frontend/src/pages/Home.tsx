import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogInClick = () => {
    navigate("/login");
  };
  const handleSignUpClick = () => {
    navigate("/signup");
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-medium mb-6">Finance Tracker</h1>
      <div className="flex space-x-4">
        <button
          onClick={handleLogInClick}
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition"
        >
          Log In
        </button>
        <button
          onClick={handleSignUpClick}
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
