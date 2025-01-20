import { UserService } from "@/services/user";
import { Dispatch, SetStateAction } from "react";
import StringUtils from "@/utils/stringUtils";
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

export default function CategoryList({ categories, type, refresh, setRefresh }: CategoryListProps) {
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
        <div key={index} className="bg-gray-400 border-2 rounded border-gray-500 px-1 m-1">
          {StringUtils.capitalise(category)} <button onClick={() => handleClick(category)}>X</button>
        </div>
      ))}
    </div>
  );
}
