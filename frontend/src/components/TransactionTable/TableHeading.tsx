import { SortIcon } from "@/assets/Icons";

interface TableHeadingProps {
  heading: sortField;
  handleSortingChange?: (field: sortField) => void;
}

type sortField = "date" | "type" | "category" | "amount" | null;

export default function TableHeading({
  heading,
  handleSortingChange,
}: TableHeadingProps) {
  return (
    <div className="flex justify-center">
      <h2>{heading && heading.charAt(0).toUpperCase() + heading.slice(1)}</h2>
      {handleSortingChange !== undefined && (
        <button onClick={() => handleSortingChange(heading)}>
          <SortIcon />
        </button>
      )}
    </div>
  );
}
