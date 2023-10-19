import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import db from "@/lib/prismadb";

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
