import { UserService } from "@/services/user";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";

interface Categories {
  expenses: string[];
  income: string[];
  savings: string[];
};

interface CategoryFormProps {
  type: string;
  placeholder: string;
  categories: Categories;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;

}

export default function CategoryForm({ type, placeholder, categories, refresh, setRefresh }: CategoryFormProps) {
  const [inputValue, setInputValue] = useState("");
  const token = localStorage.getItem("token")
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const updateCategories = {...categories}
    Object.keys(updateCategories).forEach((key) => {
      const typedkey = key as keyof Categories
      if (typedkey === type) {
        updateCategories[typedkey] = [...updateCategories[typedkey], inputValue]
      }
    })
    if (token) {
      await UserService.updateCategories(token, updateCategories)
      setRefresh(!refresh)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={type}></label>
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        id={type}
        name={type}
        onChange={handleChange}
      />
      <button type="submit">+</button>
    </form>
  );
}
