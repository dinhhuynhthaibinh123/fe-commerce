import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/db";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: any;
    params: { storeId: string };
}) {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: { id: params.storeId, userId },
    });

    if (!store) {
        redirect("/");
    }

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}
