import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const stores = await prismadb.store.findMany({
            where: {
                userId
            }
        })

        return NextResponse.json(stores)
    } catch (error) {
        console.log("[STORES_GET]", error)
        return new NextResponse("Internal error",
            { status: 500 })
    }
}

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store)
    } catch (error) {
        console.log("[STORES_POST]", error)
        return new NextResponse("Internal error",
            { status: 500 })
    }
}

