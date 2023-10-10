import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateCategorySchema = z.object({
  name: z.string(),
  storeId: z.string(),
  billboardId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const parsedBody = CreateCategorySchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { name, storeId, billboardId } = parsedBody.data;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(parsedBody)
    // Kontrollerar att användaren äger butiken.
    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized to add category to this store", { status: 403 });
    }

    // Skapar kategorin
    const category = await prismadb.category.create({
      data: {
        name,
        storeId,
        billboardId: billboardId ?? ""
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
