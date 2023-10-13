import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateBrandNameSchema = z.object({
    brandName: z.string(),
    storeId: z.string(),
});

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json()
        console.log(body)

        const schemaInput = {
            ...body,
            ...params
        }
        console.log(schemaInput)
        const parsedBody = CreateBrandNameSchema.safeParse(schemaInput)
        console.log(parsedBody)

        if (!parsedBody.success) {
            return new NextResponse("Invalid input", { status: 400 });
        }
        const { brandName, storeId } = parsedBody.data;

        if (!userId) {
            return new NextResponse("Unauthenticated", {
                status: 401
            })
        }

        const store = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!store) {
            return new NextResponse("Unauthorized",
                {
                    status: 403
                })
        }

        const createdBrandName = await prismadb.brandName.create({
            data: {
                storeId,
                name: brandName,
                value: ""
            }
        })

        return NextResponse.json(createdBrandName)
    } catch (error) {
        console.log("[BRAND_NAME_POST", error)
        return new NextResponse("Internal error", {
            status: 500
        })
    }
}