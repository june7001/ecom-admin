import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryManageDropdown from "./CategoryManageDropdown";

type Category = {
  id: string;
  name: string;
  storeId: string;
  createdAt: string;
};

const CategoryTable = ({
  storeId,
  categories,
  refreshCategories,
}: {
  storeId: string;
  categories: Category[];
  refreshCategories: () => void;
}) => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <Table className="border border-slate-200">
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[200px]">Created At</TableHead>
            <TableHead className="text-right">Manage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                {new Date(category.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
              <CategoryManageDropdown category={category} refreshCategories={refreshCategories} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {categories.length === 0 && (
        <div className="text-center mt-4 text-lg text-gray-600 dark:text-gray-400">
          No categories available.
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
