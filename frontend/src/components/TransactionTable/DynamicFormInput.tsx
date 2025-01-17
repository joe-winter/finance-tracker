import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { ChevronDown } from "@/assets/Icons";
interface DynamicFormInput {
  placeholder: string;
  choices?: string[];
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  size: number;
}

function capitaliseString(string: string): string {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return "";
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
  if (choices && value !== "" && !choices.includes(value) ) {
    console.log("hello there")
    onChange("")
  }

  const handleOptionSelect = (choice: string) => {
    onChange(choice)
    setIsOpen(false)
  }
  return (
    <div>
      <div className="flex">
        <input
          type="text"
          name=""
          id=""
          placeholder={placeholder}
          value={capitaliseString(value)}
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
        <div className="bg-white absolute">
          {choices &&
            choices.map((choice, index) => (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => handleOptionSelect(choice)}
                >
                  {capitaliseString(choice)}
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
