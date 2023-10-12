import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Category = {
  id: string;
  name: string;
  storeId: string;
  createdAt: string;
};

export default function CategoryDeleteBtn({
  category,
  refreshCategories,
}: {
  category: Category;
  refreshCategories: () => void;
}) {
  const handleDelete = async () => {
    try {
      console.log(category);
      const res = await fetch(
        `/api/stores/${category.storeId}/category/${category.id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        refreshCategories();
      } else {
        console.error("Failed to delete category:", await res.json());
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full flex items-center"
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category <span className="font-bold">{category.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-rose-600 hover:bg-rose-500"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
