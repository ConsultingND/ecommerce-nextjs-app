// Load initial cart products data
import ShoppingCartList from "./ShoppingCartList";

export const dynamic = 'force-dynamic';

export default async function CartPage(){
  const response = await fetch(`http://localhost:3000/api/cart`, { //loading the cart using session
        cache: 'no-cache', //prevent it from giving us stale data
  });
  const cartProducts = await response.json();

  return (
    <ShoppingCartList initialCartProducts={cartProducts}/>
  )
}

