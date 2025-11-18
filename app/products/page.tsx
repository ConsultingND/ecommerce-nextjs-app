import ProductsList from "../ProductList"

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/products`, { cache: 'no-cache' }); //loading the products
  const products = await response.json();

  const cartResponse = await fetch(`${baseUrl}/api/cart`, { cache: 'no-cache' }); //load shopping cart using session
  const cartProducts = await cartResponse.json()

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