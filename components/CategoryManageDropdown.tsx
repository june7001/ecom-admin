import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BsThreeDots } from "react-icons/bs";

import CategoryDeleteBtn from "./CategoryDeleteBtn";

type Category = {
  id: string;
  name: string;
  storeId: string;
  createdAt: string;
};

export default function CategoryManageDropdown({
  category,
  refreshCategories,
}: {
  category: Category;
  refreshCategories: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
          <BsThreeDots className="text-2xl hover:bg-gray-300 rounded-full p-1 transition ease-in-out duration-200" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Manage Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
        <DropdownMenuItem>
          <CategoryDeleteBtn
            category={category}
            refreshCategories={refreshCategories}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
