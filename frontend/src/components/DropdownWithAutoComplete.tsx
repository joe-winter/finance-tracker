import { useState } from "react";

interface DropdownWithAutoCompleteProps {
  placeholder: string;
  options: string[];
}

export default function DropdownWithAutoComplete({
  placeholder,
  options,
}: DropdownWithAutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex">
        <input type="text" name="" id="" placeholder={placeholder} />
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="chevron-svg"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m8 10 4 4 4-4"
            />
          </svg>
        </button>
      </div>
      {isOpen &&
        options.map((option, index) => <div key={index}>{option}</div>)}
    </div>
  );
}
