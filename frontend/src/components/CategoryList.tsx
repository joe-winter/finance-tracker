import { UserService } from "@/services/user";
import { Dispatch, SetStateAction } from "react";

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
    console.log("clicked", category);
    categories[categoryType] = categories[categoryType].filter(
      (element) => element !== category
    );
    if (token) {
      await UserService.updateCategories(token, categories);
      setRefresh(!refresh);
    }
  };
  return (
    <>
      {categories[categoryType].map((category, index) => (
        <div key={index}>
          {category} <button onClick={() => handleClick(category)}>X</button>
        </div>
      ))}
    </>
  );
}
