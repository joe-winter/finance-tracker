
interface TableHeadingProps {
  heading: sortField;
  handleSortingChange: (field: sortField) => void;
}

type sortField = "date" | "type" | "category" | "amount" | null

export default function TableHeading({ heading, handleSortingChange }: TableHeadingProps) {
  
  return (
    <div className="flex justify-center">
      <h2>{heading}</h2>
      <button onClick={() =>handleSortingChange(heading)}>
        <svg
          data-testid="sort-svg"
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m8 15 4 4 4-4m0-6-4-4-4 4"
          />
        </svg>
      </button>
    </div>
  );
}
