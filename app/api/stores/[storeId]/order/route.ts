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
            product: {
              select: {
                price: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Calculate total price for each order
    // A tad yanky, but Vercel is fast enough?
    const ordersWithTotalPrice: typeof orders & { totalPrice: number }[] =
      orders.map((order) => {
        let totalPrice = 0;
        order.orderItems.forEach((orderItem) => {
          totalPrice += Number(orderItem.product.price);
        });
        return { ...order, totalPrice };
      });

    return NextResponse.json(ordersWithTotalPrice);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

const CreateOrderSchema = z.object({
  storeId: z.string().min(1),
  address: z.string(),
  phone: z.string(),
  orderItems: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })
    )
    .min(1),
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

    const validationResult = await CreateOrderSchema.safeParseAsync(
      schemaInput
    );
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

const UpdateOrderSchema = z.object({
  storeId: z.string().min(1),
  orderId: z.string().min(1),
  isPaid: z.boolean().optional(),
  isDelivered: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schemaInput = {
      ...params,
      ...(await req.json()),
    };

    const validationResult = await UpdateOrderSchema.safeParseAsync(
      schemaInput
    );
    if (!validationResult.success) {
      return new NextResponse(validationResult.error.message, { status: 400 });
    }

    const { storeId, orderId, isDelivered, isPaid } = validationResult.data;

    const store = await db.store.findUnique({ where: { id: storeId, userId } });
    if (!store) {
      return new NextResponse("You do not have access to this store", {
        status: 403,
      });
    }

    const order = await db.order.findUnique({
      where: { id: orderId, storeId },
    });
    if (!order) {
      return new NextResponse("Order not found", { status: 400 });
    }

    if (isDelivered === undefined && isPaid === undefined) {
      return new NextResponse("Either isDelivered or isPaid is required", {
        status: 400,
      });
    }

    const orderUpdateResult = await db.order.update({
      data: {
        isDelivered,
        isPaid,
      },
      where: {
        id: orderId,
        storeId,
      },
    });

    return NextResponse.json(orderUpdateResult);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
