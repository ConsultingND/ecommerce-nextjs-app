'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Product } from "./product-data";

// Note syntax for defining props
export default function ProductsList({ products, initialCartProducts } : {products: Product[], initialCartProducts: Product[] }) {
    const [cartProducts, setCartProducts] = useState(initialCartProducts)
    
    // Send a POST req, using the fetch function, we applied on the client side to send a request to the addToCart route handler.
    async function addToCart(productId: string) {
        const response = await fetch(`/api/cart`, ({
            method: 'POST',
            body: JSON.stringify({
                productId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ))
    // we need to get the updated cart from the response and set that on a state inside this component
    const updatedCartProducts = await response.json();
    setCartProducts(updatedCartProducts);
    }

    async function removeFromCart(productId: string) {
        const response = await fetch(`/api/cart`, ({
            method: 'DELETE',
            body: JSON.stringify({
                productId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ))
    // we need to get the updated cart from the response and set that on a state inside this component
    const updatedCartProducts = await response.json();
    setCartProducts(updatedCartProducts);
    }

    // check if product is already it users cart
    function productIsInCart(productId: string){
        return cartProducts.some(cp => cp.id === productId);
    }

    // Grab the products and iterate over them so that we can display items on the product list page. 
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
                <Link key={ product.id } 
                    href={"/products/" + product.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg trasnsition duration-300"
                >
                    <div className="flex justify-center mb-4 h-48 relative">
                        <Image src={'/assets/' + product.imageUrl} 
                            fill
                            alt="Product Image" 
                            className="object-cover rounded-md"/>    
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{ product.name }</h2>
                    <p className="text-gray-600">${ product.price.toFixed(2) }</p>
                    {productIsInCart(product.id)
                    ? (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 py-2 px-4 rounded w-full" 
                            onClick={(e) => {
                            e.preventDefault();
                            removeFromCart(product.id)
                        }}> Remove from Cart </button>
                    ) : (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 py-2 px-4 rounded w-full" 
                            onClick={(e) => {
                            e.preventDefault();
                            addToCart(product.id);
                        }}>Add to Cart</button>
                    )}
                </Link>
            ))}
        </div>
    );
}

// Using Link tag vs Anchor is best for performance bc we do not need to load the page. 