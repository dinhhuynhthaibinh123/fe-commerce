import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {
        params,
    }: {
        params: {
            storeId: string;
        };
    }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            sizeId,
            colorId,
            images,
            isFeatured,
            isArchived,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size is required", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("Color is required", { status: 400 });
        }

        if (!images || images.length === 0) {
            return new NextResponse("At least one image is required", {
                status: 400,
            });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        // Check if the store exists and belongs to the user
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Interal server error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    {
        params,
    }: {
        params: {
            storeId: string;
        };
    }
) {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId: categoryId,
                sizeId: sizeId,
                colorId: colorId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Interal server error", { status: 500 });
    }
}
