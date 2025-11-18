import ProductsList from "../ProductList"
import { auth } from "@/auth"
import { connectToDB } from "@/app/api/db"
import { Product } from "../product-data"

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // Get session for authenticated user
  const session = await auth();

  // Fetch products directly from database
  const { db } = await connectToDB();
  const products = await db.collection('products').find({}).toArray() as unknown as Product[];

  // Fetch cart if user is logged in
  let cartProducts: Product[] = [];
  if (session?.user?.id) {
    const userCart = await db.collection('carts').findOne({ userId: session.user.id });
    if (userCart) {
      cartProducts = await db.collection('products').find({
        id: { $in: userCart.cartIds }
      }).toArray() as unknown as Product[];
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8"> Product Page </h1>
      <ProductsList products={products} initialCartProducts={cartProducts}/>
    </div>
  )
}

// Checking the Network tab if we look at this page, we'll see that all of those products are already there,
//  That's because of server-side rendering. So, in the case of our products page, because
//  we're using MongoDB behind the scenes, what's happening is when we send a request to this 
// URL /products, our browser is sending a request to Next.js. Next.js is rendering our 
// component, which uses that fetch function to load data from our route handler. 
// Our route handler is using MongoDB to store its data. And then Next.js is sending us the
//  completely rendered result. So, even though we're just seeing static HTML when we send a 
// request to this URL, we really are working with a full-stack application now.