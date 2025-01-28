import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ChevronDown } from "@/assets/Icons";
import StringUtils from "@/utils/stringUtils";
interface DynamicFormInput {
  placeholder: string;
  choices?: string[];
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  size: number;
}

export default function DynamicFormInput({
  placeholder,
  choices,
  value,
  onChange,
  size,
}: DynamicFormInput) {
  const [isOpen, setIsOpen] = useState(false);

  // resets input value if input value is no longer in options
  useEffect(() => {
    if (choices && value !== "" && !choices.includes(value)) {
      console.log("hello there");
      onChange("");
    }
  }, [choices, onChange, value]);

  const handleOptionSelect = (choice: string) => {
    onChange(choice);
    setIsOpen(false);
  };
  return (
    <div className="relative flex bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded min-h-7 items-center">
      <div className="flex rounded">
        <input
          className="bg-gray-50 dark:bg-gray-700 placeholder:p-1"
          type="text"
          name=""
          id=""
          placeholder={placeholder}
          value={StringUtils.capitalise(value)}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          onClick={() => setIsOpen(!isOpen)}
          size={size}
        />
        {choices && (
          <button type="button" onClick={() => setIsOpen(!isOpen)}>
            <ChevronDown />
          </button>
        )}
      </div>
      {choices && isOpen && (
        <ul className="absolute top-full bg-white border dark:bg-gray-700 dark:border-gray-600 rounded shadow-md mt-2 w-full max-h-60 overflow-auto z-40">
          {choices &&
            choices.map((choice, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="px-4 py-2 whitespace-nowrap"
                  onClick={() => handleOptionSelect(choice)}
                >
                  {StringUtils.capitalise(choice)}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
