// Secure shopping cart API - uses authenticated user
import { connectToDB } from "@/app/api/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { UpdateFilter } from "mongodb";

type CartBody = {
    productId: string;
}

type Cart = {
    userId: string;
    cartIds: string[];
}

// GET - Load shopping cart for authenticated user
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const { db } = await connectToDB();

        // Get user's cart from database
        const userCart = await db.collection<Cart>('carts').findOne({ userId });

        if (!userCart) {
            return NextResponse.json([], { status: 200 });
        }

        const cartIds = userCart.cartIds;

        // Populate cart with product details
        const cartProducts = await db.collection('products').find({
            id: { $in: cartIds }
        }).toArray();

        return NextResponse.json(cartProducts, { status: 200 });

    } catch (error) {
        console.error("Get cart error:", error);
        return NextResponse.json(
            { error: 'Failed to load cart' },
            { status: 500 }
        );
    }
}

// POST - Add product to authenticated user's cart
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const { db } = await connectToDB();

        const body: CartBody = await request.json();
        const productId = body.productId;

        // Input validation
        if (!productId || typeof productId !== 'string') {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        // Validate product exists
        const product = await db.collection('products').findOne({ id: productId });
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Add product to cart
        const updateOperation: UpdateFilter<Cart> = {
            $push: { cartIds: productId }
        };

        const updatedCart = await db.collection<Cart>('carts').findOneAndUpdate(
            { userId },
            updateOperation,
            { upsert: true, returnDocument: 'after' }
        );

        if (!updatedCart) {
            return NextResponse.json(
                { error: 'Failed to update cart' },
                { status: 500 }
            );
        }

        // Get updated cart products
        const cartProducts = await db.collection('products').find({
            id: { $in: updatedCart.cartIds }
        }).toArray();

        return NextResponse.json(cartProducts, { status: 201 });

    } catch (error) {
        console.error("Add to cart error:", error);
        return NextResponse.json(
            { error: 'Failed to add product to cart' },
            { status: 500 }
        );
    }
}

// DELETE - Remove product from authenticated user's cart
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const { db } = await connectToDB();

        const body = await request.json();
        const productId = body.productId;

        // Input validation
        if (!productId || typeof productId !== 'string') {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        // Remove product from cart
        const updateOperation: UpdateFilter<Cart> = {
            $pull: { cartIds: productId }
        };

        const updatedCart = await db.collection<Cart>('carts').findOneAndUpdate(
            { userId },
            updateOperation,
            { returnDocument: 'after' }
        );

        if (!updatedCart) {
            return NextResponse.json([], { status: 200 });
        }

        // Get updated cart products
        const cartProducts = await db.collection('products').find({
            id: { $in: updatedCart.cartIds }
        }).toArray();

        return NextResponse.json(cartProducts, { status: 200 });

    } catch (error) {
        console.error("Remove from cart error:", error);
        return NextResponse.json(
            { error: 'Failed to remove product from cart' },
            { status: 500 }
        );
    }
}
