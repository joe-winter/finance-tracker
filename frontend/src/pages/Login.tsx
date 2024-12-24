import LoginForm from "../components/LoginForm"

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Login</h2>
      <LoginForm />
    </div>
  );
}
