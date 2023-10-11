import prismadb from "@/lib/prismadb";
import { BrandNameForm } from "./components/brandname-form";

const BrandNamePage = async ({
    params
}: {
    params: { brandNameId: string }
}) => {
    const brandName = await prismadb.brandName.findUnique({
        where: {
            id: params.brandNameId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BrandNameForm />
            </div>
        </div>
    )
}

export default BrandNamePage; 