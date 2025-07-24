"use client";

import { XIcon } from "lucide-react";
import type { DeleteCategoryOutput } from "@/lib/types";
import { Badge } from "../ui/badge";

interface CategoriesBadgeProps {
  category: DeleteCategoryOutput;
  handleDelete: (id: string) => void;
}

export const CategoriesBadge = ({
  category,
  handleDelete,
}: CategoriesBadgeProps) => {
  return (
    <Badge onClick={() => handleDelete(category.id)} className="cursor-pointer">
      {category.name}
      <XIcon />
    </Badge>
  );
};
