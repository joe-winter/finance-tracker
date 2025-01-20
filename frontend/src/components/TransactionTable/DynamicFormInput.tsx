import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
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

  // reset input on if input not in options
  if (choices && value !== "" && !choices.includes(value)) {
    console.log("hello there");
    onChange("");
  }

  const handleOptionSelect = (choice: string) => {
    onChange(choice);
    setIsOpen(false);
  };
  return (
    <div>
      <div className="flex border border-gray-200 rounded">
        <input
          className="bg-gray-50 placeholder:p-1"
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
        <ul className="bg-gray-50 border border-gray-200 rounded absolute w-full">
          {choices &&
            choices.map((choice, index) => (
              <li key={index}>
                <button
                  type="button"
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
