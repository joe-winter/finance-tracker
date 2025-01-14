import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

interface DropdownWithAutoCompleteProps {
  placeholder: string;
  options: string[];
  state: string;
  setStateFunc: Dispatch<SetStateAction<string>>;
}

function capitaliseString (string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function DropdownWithAutoComplete({
  placeholder,
  options,
  state,
  setStateFunc,
}: DropdownWithAutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  // reset input on if input not in options
  if (state !== "" && !options.includes(state) ) {
    setStateFunc("")
  }
  return (
    <div>
      <div className="flex">
        <input
          type="text"
          name=""
          id=""
          placeholder={placeholder}
          value={capitaliseString(state)}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setStateFunc(e.target.value)
          }
          onClick={() => setIsOpen(!isOpen)}
        />
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
      {isOpen && (
        <div className="bg-white absolute">
          {options && options.map((option, index) => (
            <div key={index}>
              <button
                onClick={() => {
                  setStateFunc(option);
                  setIsOpen(false);
                }}
              >
                {capitaliseString(option)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
