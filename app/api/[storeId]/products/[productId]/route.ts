import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    _req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("Product id is required", {
                status: 400,
            });
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Interal server error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
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

        if (!params.productId) {
            return new NextResponse("Product id is required", {
                status: 400,
            });
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                images: {
                    deleteMany: {},
                },
            },
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
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
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Interal server error", { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("Product id is required", {
                status: 400,
            });
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Interal server error", { status: 500 });
    }
}
