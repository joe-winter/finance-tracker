import SignUpForm from "../components/SignUpForm";

export default function SignUp() {

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Sign Up</h2>
      <SignUpForm/>
    </div>
  );
}
