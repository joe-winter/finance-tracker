import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate()

  const handleLogInClick = () => {
    navigate("/login")
  }
  const handleSignUpClick = () => {
    navigate("/signup")
  }
  return (
    <div className="h-screen flex items-center justify-center space-x-4">
      <button onClick={handleLogInClick} className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition">Log In</button>
      <button onClick={handleSignUpClick} className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition">Sign Up</button>
    </div>
  );
}
