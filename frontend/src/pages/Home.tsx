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
    <>
      <button onClick={handleLogInClick}>Log In</button>
      <button onClick={handleSignUpClick}>Sign Up</button>
    </>
  );
}
