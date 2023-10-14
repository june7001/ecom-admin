import db from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

const GetByCategorySchema = z.object({
  storeId: z.string().min(1),
  categoryId: z.string().min(1),
});

// /api/stores/[storeId]/product/by-category/[categoryId]
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  const parseResult = GetByCategorySchema.safeParse(params);
  if (!parseResult.success) {
    return new NextResponse("Invalid input", { status: 400 });
  }

  //the user is specifying a valid category choise
  const { categoryId, storeId } = parseResult.data;

  //get all products from the store with the specified category
  const productsByCategory = await db.product.findMany({
    where: {
      storeId,
      categoryId,
    },
    select: {
      id: true,
      name: true,
      price: true,
      weight: true,
      storeId: true,
      brandName: {
        select: {
          id: true,
          name: true,
          value: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        select: {
          url: true,
        },
      },
      isArchived: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(productsByCategory);
}
