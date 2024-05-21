import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/db";

export default async function SetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Find the store associated with the user
    const store = await prismadb.store.findFirst({
        where: { userId },
    });

    // Redirect to the store setup page if the user has a store
    if (store) {
        redirect(`/${store.id}`);
    }

    return <>{children}</>;
}
