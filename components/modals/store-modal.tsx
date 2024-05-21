"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post("/api/stores", values);

            // Why not use the router?
            // Because we want to reload the page to fetch the new store.
            // We could use the router to navigate to the new store page.
            // But we would have to fetch the store data again.
            // So, it's better to reload the page.
            // router.push(`/${response.data.id}`);
            window.location.assign(`/${response.data.id}`);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create Store"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
            description="Add a new store to manage products and categories."
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={loading}
                                                    placeholder="E-commerce"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end">
                                <Button
                                    disabled={loading}
                                    variant="outline"
                                    onClick={storeModal.onClose}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={loading} type="submit">
                                    Comtinute
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};
