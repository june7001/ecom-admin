import db from "@/lib/prismadb";
import { NextResponse } from "next/server";

async function allProducts(storeId: string) {
  return await db.product.findMany({
    where: {
      storeId: storeId,
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
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    return NextResponse.json(await allProducts(params.storeId));
  } catch (err) {
    console.log("[PRODUCT_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
