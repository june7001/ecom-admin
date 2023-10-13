"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"


const formSchema = z.object({
    brandName: z.string().min(2, {
        message: "Brand name must be at least 2 characters.",
    }),
})

type BrandNameFormValues = z.infer<typeof formSchema>;


export const BrandNameForm: React.FC = () => {

    const params = useParams();
    const title = "Create brand name";

    const form = useForm<BrandNameFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            brandName: ""
        }
    })

    const onSubmit = async (data: BrandNameFormValues) => {
        try {
            console.log("hej", data)
            const response = await axios.post(`/api/stores/${params.storeId}/brandname/`, data);
            toast.success("New brand created");
            console.log("brand created:", response.data);
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    return (
        <>
            <div className="flex items-center justify-between">
                <h1>{title}</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="brandName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Add brand name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create</Button>
                </form>
            </Form>
        </>
    )
}


