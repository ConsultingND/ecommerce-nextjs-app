// Load initial cart products data
import ShoppingCartList from "./ShoppingCartList";
import { auth } from "@/auth";
import { connectToDB } from "@/app/api/db";
import { Product } from "../product-data";

export const dynamic = 'force-dynamic';

export default async function CartPage(){
  // Get session for authenticated user
  const session = await auth();

  // Fetch cart directly from database
  let cartProducts: Product[] = [];
  if (session?.user?.id) {
    const { db } = await connectToDB();
    const userCart = await db.collection('carts').findOne({ userId: session.user.id });

    if (userCart && userCart.cartIds) {
      cartProducts = await db.collection('products').find({
        id: { $in: userCart.cartIds }
      }).toArray() as unknown as Product[];
    }
  }

  return (
    <ShoppingCartList initialCartProducts={cartProducts}/>
  )
}

