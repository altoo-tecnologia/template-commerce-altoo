import { getCart } from 'lib/shopify';
// import { cookies } from 'next/headers';
import CartModal from './modal';
import nookies from "nookies";

export default async function Cart() {
  const cookieStore = nookies.get();
  
  // const cartId = cookies().get('cartId')?.value
  let cart;

  if (cookieStore['cartId']) {
    cart = await getCart(cookieStore['cartId']);
  }

  return <CartModal cart={cart} />;
}
