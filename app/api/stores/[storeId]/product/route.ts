import db from "@/lib/prismadb";
import { NextResponse } from "next/server";

async function allProducts(storeId: string) {
  return await db.product.findMany({
    where: {
      storeId: storeId,
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
