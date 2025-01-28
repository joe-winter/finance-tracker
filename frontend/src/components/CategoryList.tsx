import { UserService } from "@/services/user";
import { Dispatch, SetStateAction } from "react";
import StringUtils from "@/utils/stringUtils";
import { RedX } from "@/assets/Icons";
interface CategoryListProps {
  categories: Categories;
  type: string;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}
interface Categories {
  expenses: string[];
  income: string[];
  savings: string[];
}

export default function CategoryList({
  categories,
  type,
  refresh,
  setRefresh,
}: CategoryListProps) {
  const token = localStorage.getItem("token");
  const categoryType = type as keyof Categories;

  const handleClick = async (category: string) => {
    categories[categoryType] = categories[categoryType].filter(
      (element) => element !== category
    );
    if (token) {
      await UserService.updateCategories(token, categories);
      setRefresh(!refresh);
    }
  };
  return (
<div className="flex flex-wrap">
  {categories[categoryType].map((category, index) => (
    <div
      key={index}
      className="border rounded dark:bg-gray-700 dark:border-gray-600 bg-gray-50 px-2 py-1 m-1 flex items-center gap-2"
    >
      <span>{StringUtils.capitalise(category)}</span>
      <button onClick={() => handleClick(category)}>
        <RedX />
      </button>
    </div>
  ))}
</div>

  );
}
