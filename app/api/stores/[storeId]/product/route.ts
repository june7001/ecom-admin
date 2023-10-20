import db from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { isUuid } from "uuidv4";

async function allProducts(storeId: string) {
  return await db.product.findMany({
    where: {
      storeId: storeId,
    },
    select: {
      id: true,
      name: true,
      price: true,
      amount: true,
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

const CreateProductSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1).uuid(),
  amount: z.string().min(1),
  stock: z.coerce.number().min(0),
  brandNameId: z.string().min(1).uuid(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

const storeIdValidator = z.string().uuid();


export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = CreateProductSchema.safeParse(await req.json());
    console.log(body)

    const storeIdValidation = storeIdValidator.safeParse(await params.storeId)
    if (!storeIdValidation.success) {
      return new NextResponse("Bad store ID", { status: 400 })
    }

    if (!body.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { name, images, price, categoryId, amount, stock, brandNameId, isFeatured, isArchived } = body.data;

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    })

    if (!store) {
      return new NextResponse("Unauthorized to add product to this store", {
        status: 403,
      })
    }

    const createProduct = await prismadb.product.create({
      data: {
        name,
        images: {
          createMany: {
            data: images
          }
        },
        price,
        categoryId,
        amount,
        stock,
        brandNameId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
      },
      include: { images: true }
    });

    return NextResponse.json(createProduct);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("internal error", {
      status: 500
    })
  }
}


// export async function PATCH(req: Request) {
//   try {
//     const { userId } = auth();
//     const { productId, categoryId, imageId, brandNameId } = await req.json();

//     const product = await prismadb.product.findFirst({
//       where: {
//         id: productId
//       }
//     })

//     if (!userId) {
//       return new NextResponse("User is unauthorized", { status: 401 })
//     }
//     if (!product) {
//       return new NextResponse("Product not found", { status: 404 })
//     }

//     await prismadb.product.update({
//       where: {
//         id: productId
//       },
//       data: {
//         brandNameId: "",
//         categoryId: "",
//         ammount: "",
//         imageId: "",
//         isArchived: "",
//         isFeatured: "",
//       }
//     })

//     return new NextResponse("Product updated", { status: 200 })
//   } catch (error) {
//     console.error("[UPDATE_PRODUCT]", error)
//     return new NextResponse("internal error", { status: 500 })
//   }
// }