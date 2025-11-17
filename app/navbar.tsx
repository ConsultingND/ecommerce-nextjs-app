"use client"

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/auth/login");
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/products" className="text-gray-700 hover:text-black">Products</Link>
                    </li>
                    <li>
                        <Link href="/cart" className="text-gray-700 hover:text-black">Carts</Link>
                    </li>
                    <li>
                        <Link href="/checkout" className="text-gray-700 hover:text-black">Checkout</Link>
                    </li>
                </ul>
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
}