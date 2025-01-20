import { ChevronLeft, ChevronRight } from "@/assets/Icons";

interface PageSelectorProps {
  pageNumber: number;
  onPageChange: (pageNumber: number) => void;
}

export default function PageSelector({
  pageNumber,
  onPageChange,
}: PageSelectorProps) {
  return (
    <div className="flex">
      <button onClick={() => onPageChange(pageNumber - 1)}>
        <ChevronLeft />
      </button>
      <div>{pageNumber}</div>
      <button onClick={() => onPageChange(pageNumber + 1)}>
        <ChevronRight />
      </button>
    </div>
  );
}
