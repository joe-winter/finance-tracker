import { ChevronDown } from "@/assets/Icons";
import { Dispatch, SetStateAction, useState } from "react";

interface DropdownProps<T extends string | number> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  options: T[];
  size?: string
}

export default function Dropdown<T extends string | number>({ value, setValue, options, size }: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option: T) => {
    setValue(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${size ? size : "w-min"}`}>
      {/* Dropdown Trigger */}
      <div
        className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 p-1 rounded cursor-pointer"
        onClick={toggleDropdown}
      >
        <span>{value}</span>
        <ChevronDown />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute bg-gray-100 border rounded dark:bg-gray-700 dark:border-gray-600 shadow-md mt-2 w-full max-h-60 overflow-auto z-40">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2"
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
