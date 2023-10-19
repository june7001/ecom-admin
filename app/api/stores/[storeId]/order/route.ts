import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import db from "@/lib/prismadb";
import { z } from "zod";

import { checkStockAvailability, createOrderItems } from "./helpers";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { storeId } = params;
    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const store = await db.store.findUnique({ where: { id: storeId, userId } });
    if (!store) {
      return new NextResponse("You do not have access to this store", {
        status: 403,
      });
    }

    const orders = await db.order.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        address: true,
        phone: true,
        isDelivered: true,
        isPaid: true,
        orderItems: {
          select: {
            id: true,
            productId: true,
            orderId: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

const CreateOrderSchema = z.object({
  storeId: z.string().min(1),
  address: z.string(),
  phone: z.string(),
  orderItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ),
});

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const schemaInput = {
      ...params,
      ...(await req.json()),
    };

    const validationResult = CreateOrderSchema.safeParse(schemaInput);
    if (!validationResult.success) {
      return new NextResponse(validationResult.error.message, { status: 400 });
    }

    const validated = validationResult.data;
    const { storeId, address, phone, orderItems: flatOrderItems } = validated;

    const unavailableProducts = await checkStockAvailability(flatOrderItems);
    const thereIsUnavailableProducts = unavailableProducts.length > 0;
    if (thereIsUnavailableProducts) {
      return NextResponse.json(
        {
          message: "Some products are unavailable",
          unavailableProducts,
        },
        { status: 400 }
      );
    }

    // Every order item has a quantity, so we need to create
    // an order item for each quantity
    let orderItems: { productId: string }[] = [];
    flatOrderItems.forEach((item) => {
      const orders = createOrderItems(item.quantity, item.productId);

      orderItems = [...orderItems, ...orders];
    });

    const createdOrder = await db.order.create({
      data: {
        storeId,
        address,
        phone,
        orderItems: {
          create: orderItems,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
