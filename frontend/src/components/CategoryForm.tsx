import { Plus } from "@/assets/Icons";
import { UserService } from "@/services/user";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

interface Categories {
  expenses: string[];
  income: string[];
  savings: string[];
}

interface CategoryFormProps {
  type: string;
  placeholder: string;
  categories: Categories;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CategoryForm({
  type,
  placeholder,
  categories,
  refresh,
  setRefresh,
}: CategoryFormProps) {
  const [inputValue, setInputValue] = useState("");
  const token = localStorage.getItem("token");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const categoryType = type as keyof Categories;
    const duplicate = categories[categoryType].some(
      (element) => element.toLowerCase() === inputValue.toLowerCase()
    );

    if (inputValue === "" || duplicate) {
      console.log("Invalid category");
      return;
    }

    categories[categoryType] = [...categories[categoryType], inputValue];

    if (token) {
      await UserService.updateCategories(token, categories);
      setRefresh(!refresh);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={type}></label>
      <div className="flex bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded items-center">
        <input
          className="bg-gray-100 dark:bg-gray-700 placeholder:p-1 p-1"
          type="text"
          value={inputValue}
          placeholder={placeholder}
          id={type}
          name={type}
          onChange={handleChange}
        />
        <button className="p-1"type="submit"><Plus/></button>
      </div>
    
    </form>
  );
}
