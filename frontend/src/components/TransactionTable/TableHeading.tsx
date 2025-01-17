import { SortIcon } from "@/assets/Icons";

interface TableHeadingProps {
  heading: string;
  handleSortingChange?: (field: string, type: SortType) => void;
  type: SortType;
}

type SortType = "date" | "number" | "string" | null;

export default function TableHeading({
  heading,
  type,
  handleSortingChange,
}: TableHeadingProps) {
  return (
    <div className="flex justify-center">
      <h2>{heading && heading.charAt(0).toUpperCase() + heading.slice(1)}</h2>
      {handleSortingChange !== undefined && type !== null && (
        <button
          type="button"
          onClick={() => handleSortingChange(heading, type)}
        >
          <SortIcon />
        </button>
      )}
    </div>
  );
}
