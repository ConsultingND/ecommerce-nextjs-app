'use client' //client side rendering

import { useState } from "react"
import { Product } from "../product-data";
import Link from 'next/link';

export default function ShoppingCartList({ initialCartProducts }: { initialCartProducts: Product[] }) {
    // Short cut since our shopping car endpoint returns the actually populated prorducts from the backend
  const [cartProduts, setCartProducts] = useState(initialCartProducts);

  async function removeFromCart(productId: string) {
    const response = await fetch(`/api/cart`, {
      method: 'DELETE',
      body: JSON.stringify({
        productId,
      }),
      headers: {
        'Content-Type' : 'application/json'
      }
    });

    const updatedCartProducts = await response.json()
    setCartProducts(updatedCartProducts);
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      <ul className="space-y-4">
        {cartProduts.map(product => (
          <li key={product.id} className="bg-white rounded-lg shadow-md p-4 hover-shadow-lg transform duration-300">
            <Link key={ product.id } href={"/products/" + product.id}>
            <h3 className="text-xl font-semibold mb-2">{ product.name }</h3>
            <p className="text-gray-600">${ product.price.toFixed(2) }</p>
            <div className="flex justify-end">
              <button className="bg-blue-500 hover:bg-bue-700 text-white font-bold py-2 px-4 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromCart(product.id);
                }}> Remove from Cart
              </button>
            </div>     
          </Link>
          </li>
        ))}

      </ul>
    </div>
  )
}

// Represents the child componet that Manages the state of our products in users cart
// We define the initalState of the shopping cart