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

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const { storeId } = params;
    
    // Validate storeId format
    if (!storeId || !isUuid(storeId)) {
      return new NextResponse("Invalid input: Store ID is missing or not a UUID", { status: 400 });
    }

    // Check if the user owns the store
    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      return new NextResponse(
        "Store not found",
        { status: 404 }
      );
    }

    // Fetch all categories for the store
    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });

    if (categories.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    const { productId, categoryId } = await req.json();

    const product = await prismadb.product.findFirst({
      where: { id: productId },
    });

    const category = await prismadb.category.findFirst({
      where: { id: categoryId },
    });

    if (!userId) {
      return new NextResponse("User is unauthorized", { status: 401 });
    }

    if (!product || !category) {
      return new NextResponse("Product or category not found", { status: 404 });
    }

    await prismadb.product.update({
      where: { id: productId },
      data: {
        categoryId: "",
      },
    });

    return new NextResponse("Product removed from category", { status: 200 });
  } catch (error) {
    console.error("[REMOVE_PRODUCT_FROM_CATEGORY]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
