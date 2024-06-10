"use client";

import * as z from "zod";
import { Image, Product } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(0),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    categoryId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData:
        | (Product & {
              images: Image[];
          })
        | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initial values for the form through the initialData prop
    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit your Product" : "Add a new Product";
    const toastMessage = initialData
        ? "Product updated successfully."
        : "Product created successfully.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  price: parseFloat(String(initialData.price)),
              }
            : {
                  name: "",
                  images: [],
                  price: 0,
                  categoryId: "",
                  sizeId: "",
                  colorId: "",
                  isFeatured: false,
                  isArchived: false,
              },
    });

    const onSubmit = async (data: ProductFormValues) => {
        console.log("data", data);

        return;
        try {
            setLoading(true);

            if (initialData) {
                await axios.patch(
                    `/api/${params.storeId}/billboards/${params.billboardId}`,
                    data
                );
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }

            router.push(`/${params.storeId}/billboards`);
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `/api/${params.storeId}/billboards/${params.billboardId}`
            );
            router.push(`/${params.storeId}/billboards`);
            router.refresh();
            toast.success("Billboard deleted successfully.");
        } catch (error) {
            toast.error(
                "Make sure you removed add categories using this billboard."
            );
        } finally {
            setLoading(false);
        }
    };

    console.log("form values images", form.getValues("images"));

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Separator />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        values={field.value.map(
                                            (image) => image.url
                                        )}
                                        disabled={loading}
                                        onChange={(url) => {
                                            console.log(
                                                "============================"
                                            );
                                            console.log("url", url);
                                            console.log(
                                                "field.value",
                                                field.value
                                            );
                                            console.log(
                                                "==========================="
                                            );

                                            const newImages = [];

                                            const oldImage =
                                                form.getValues("images");

                                            if (oldImage.length === 0) {
                                                newImages.push({ url });
                                            } else {
                                                newImages.push(...oldImage);
                                                newImages.push({ url });
                                            }

                                            console.log("newImages", newImages);

                                            field.onChange(newImages);
                                        }}
                                        onRemove={(url) =>
                                            field.onChange([
                                                ...field.value.filter(
                                                    (current) =>
                                                        current.url !== url
                                                ),
                                            ])
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Billboard name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div> */}
                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                    >
                        {action}
                    </Button>
                </form>
            </Form>

            <Separator />
        </>
    );
};
