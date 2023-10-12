import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const ParamsSchema = z.object({
  storeId: z.string().uuid(),
  categoryId: z.string().uuid(),
});

// api/stores/[storeId]/category/[categoryId].ts
export async function DELETE(req: NextRequest, { params }: { params: { storeId: string, categoryId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
    }

    // Validerar parametrarna med Zod
    const parsedParams = ParamsSchema.safeParse(params);

    if (!parsedParams.success) {
      return new NextResponse("Invalid input: IDs are missing or not UUIDs", { status: 400 });
    }

    const { storeId, categoryId } = parsedParams.data;

    // Kollar ifall användaren äger butiken
    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized: User does not have access to categories for this store", { status: 403 });
    }

    // Tar bort kategorin
    await prismadb.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
