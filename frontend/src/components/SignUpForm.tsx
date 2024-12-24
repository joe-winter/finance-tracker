import { ChangeEvent, FormEvent, useState } from "react";
import { signUp } from "../services/authentication";
import { useNavigate } from "react-router-dom";
export default function SignUpForm() {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  const formData = [
    {
      labelText: "Your Email",
      type: "text",
      id: "email",
      placeholder: "johndoe@example.com",
      value: formValue.email,
    },
    {
      labelText: "Password",
      type: "text",
      id: "password",
      placeholder: "••••••••",
      value: formValue.password,
    },
    {
      labelText: "Confirm Password",
      type: "password",
      id: "confirmPassword",
      placeholder: "••••••••",
      value: formValue.confirmPassword,
    },
    {
      labelText: "First Name",
      type: "text",
      id: "firstName",
      placeholder: "John",
      value: formValue.firstName,
    },
    {
      labelText: "Last Name",
      type: "text",
      id: "lastName",
      placeholder: "Doe",
      value: formValue.lastName,
    },
  ];
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const token = await signUp(
        formValue.email,
        formValue.password,
        formValue.firstName,
        formValue.lastName
      );
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      navigate("/signup");
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.map((data) => (
            <div key={data.id}>
              <label htmlFor={data.id} className="block mb-2 text-sm font-medium text-gray-100-900 dark:text-white">{data.labelText}</label>
              <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-100"
                type={data.type}
                name={data.id}
                id={data.id}
                placeholder={data.placeholder}
                value={data.value}
                onChange={handleChange}
              />
            </div>
          ))}
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
