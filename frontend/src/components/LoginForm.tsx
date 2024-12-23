import { useNavigate } from "react-router-dom";
import { login } from "../services/authentication";
import { ChangeEvent, FormEvent, useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }
  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Your Email</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="johndoe@example.com"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </>
  );
}
