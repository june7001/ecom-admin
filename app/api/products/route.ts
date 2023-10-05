import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, description, price, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !description || !price || !imageUrl) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
      },
    });
    console.log("Product successfully created:", product);
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { userId } = auth();
    const products = await prismadb.product.findMany();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!products) {
        return new NextResponse("No products found", { status: 404 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
    }
}
