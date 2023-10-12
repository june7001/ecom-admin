import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { isUuid } from 'uuidv4';

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
    console.log(parsedBody);
    // Kontrollerar att användaren äger butiken.
    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized to add category to this store", {
        status: 403,
      });
    }

    // Skapar kategorin
    const category = await prismadb.category.create({
      data: {
        name,
        storeId,
        billboardId: billboardId ?? "",
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
    }

    const storeId = req.url.split("stores/")[1].split("/category")[0];
    
    // Validate storeId format
    if (!storeId || !isUuid(storeId)) {
      return new NextResponse("Invalid input: Store ID is missing or not a UUID", { status: 400 });
    }

    // Check if the user owns the store
    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse(
        "Unauthorized: User does not have access to categories for this store",
        { status: 403 }
      );
    }

    // Fetch all categories for the store
    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });

    if (categories.length === 0) {
      return NextResponse.json({ message: "No categories available for this store" });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
