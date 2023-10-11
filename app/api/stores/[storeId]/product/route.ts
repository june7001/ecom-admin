import db from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

const GetByCategorySchema = z.object({
  categoryId: z.string().min(1),
});

async function allProducts(storeId: string) {
  return await db.product.findMany({
    where: {
      storeId,
    },
  });
}

export async function GET(req: Request) {
  try {
    const reqUrl = new URL(req.url);
    const storeId = req.url.split("stores/")[1].split("/product")[0];

    const queryObject = Object.fromEntries(reqUrl.searchParams.entries());
    if ("categoryId" in queryObject === false) {
      //the user is'nt specifying any specific category choise,
      //therefore we return all the products in the store
      return NextResponse.json(await allProducts(storeId));
    }

    //the user is specifying a category choise
    const parseResult = GetByCategorySchema.safeParse(queryObject);
    if (!parseResult.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { categoryId } = parseResult.data;

    const productsByCategory = await db.product.findMany({
      where: {
        storeId,
        categoryId,
      },
    });

    return NextResponse.json(productsByCategory);
  } catch (err) {
    console.log("[PRODUCT_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
