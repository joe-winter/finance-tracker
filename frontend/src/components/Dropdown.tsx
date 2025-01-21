import { ChevronDown } from "@/assets/Icons";
import { Dispatch, SetStateAction, useState } from "react";

interface DropdownProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  options: string[];
}

export default function Dropdown({ value, setValue, options }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option: string) => {
    setValue(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-32">
      {/* Dropdown Trigger */}
      <div
        className="flex items-center justify-between bg-gray-100 pl-3 py-2 rounded cursor-pointer"
        onClick={toggleDropdown}
      >
        <span>{value}</span>
        <ChevronDown />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute bg-white border rounded shadow-md mt-2 w-full max-h-60 overflow-auto z-40">
          {options.map((option, index) => (
            <li
              key={index}
              className={"px-4 py-2"}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
