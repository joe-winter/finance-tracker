import { Dispatch, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileNavBar from "../components/MobileNavBar";

type DashboardProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Dashboard({ isOpen, setIsOpen }: DashboardProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <MobileNavBar isOpen={isOpen} setIsOpen={setIsOpen} />

      <h2
        className={`flex justify-center text-2xl font-semibold whitespace-nowrap dark:text-white p-4 ${
          isOpen ? "mt-72" : "mt-16"
        }`}
      >
        Dashboard
      </h2>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
      <div className="p-24">Hello</div>
    </>
  );
}
