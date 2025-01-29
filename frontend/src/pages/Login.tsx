import LoginForm from "../components/LoginForm"

export default function Login() {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto lg:max-w-lg md:max-w-md sm:max-w-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Login</h2>
      <LoginForm />
    </div>
  );
}
