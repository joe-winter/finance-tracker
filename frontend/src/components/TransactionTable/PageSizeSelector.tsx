import { ChevronDown } from "@/assets/Icons";
import { useState } from "react";

interface PageSizeSelectorProps {
  currentPageSize: number;
  options: number[];
  onPageSizeChange: (pageSize: number) => void;
}

export function PageSizeSelector({
  currentPageSize,
  options,
  onPageSizeChange,
}: PageSizeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex">
      <div>{currentPageSize}</div>
      <button onClick={() => setIsOpen(!isOpen)}>
        <ChevronDown />
      </button>
      {isOpen &&
        options.map((option, index) => (
          <button key={index} onClick={() => onPageSizeChange(option)}>
            {option}
          </button>
        ))}
    </div>
  );
}
