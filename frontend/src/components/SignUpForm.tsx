import { ChangeEvent, FormEvent, useState } from "react";
import { signUp } from "../services/authentication";
import { useNavigate } from "react-router-dom";
export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      navigate("/signup");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Your Email</label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="johndoe@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirm-password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <label htmlFor="first-name">First Name</label>
        <input
          type="text"
          name="firstName"
          id="first-name"
          placeholder="John"
          value={formData.firstName}
          onChange={handleChange}
        />
        <label htmlFor="last-name">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="last-name"
          placeholder="Doe"
          value={formData.lastName}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}
