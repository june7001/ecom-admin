import db from "@/lib/prismadb";

export interface OrderItem {
  productId: string;
  quantity: number;
}

async function checkStockAvailability(orderItems: OrderItem[]) {
  // For every order item, check if the product exists and if it does
  // check if the quantity is available
  const stockCheck: Promise<{ id: string; available: boolean }>[] = [];
  orderItems.forEach((item) => {
    const isStockEnough = async () => {
      const product = await db.product.findUnique({
        // gte = greater than or equal to
        where: { id: item.productId, stock: { gte: item.quantity } },
        select: { id: true },
      });

      return product
        ? { id: product.id, available: true }
        : { id: item.productId, available: false };
    };

    stockCheck.push(isStockEnough());
  });
  const stockCheckResult = await Promise.all(stockCheck);

  return stockCheckResult.filter((product) => !product.available);
}

// Used for creating multiple order items
// for a single product based on the quantity
function createOrderItems(amount: number, productId: string) {
  const orderItems = [];
  for (let i = 0; i < amount; i++) {
    orderItems.push({
      productId,
    });
  }
  return orderItems;
}

export { checkStockAvailability, createOrderItems };
