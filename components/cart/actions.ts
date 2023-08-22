'use server';

import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { cookies } from 'next/headers';
import nookies from "nookies";

export const addItem = async (variantId: string | undefined): Promise<String | undefined> => {
  // let cartId = cookies().get('cartId')?.value;
  const cookies = nookies.get();
  let cartId = cookies['cartId'];
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    console.log('console dentro do if ' + cartId);
    nookies.set({}, 'cartId', cartId, {
      maxAge: 60,
      path: '/',
    })
    // cookies().set('cartId', cartId);
  }

  if (!variantId) {
    return 'Missing product variant ID';
  }
  
  try {
    await addToCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
  } catch (e) {
    return 'Error adding item to cart';
  }
};

export const removeItem = async (lineId: string): Promise<String | undefined> => {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }
  try {
    await removeFromCart(cartId, [lineId]);
  } catch (e) {
    return 'Error removing item from cart';
  }
};

export const updateItemQuantity = async ({
  lineId,
  variantId,
  quantity
}: {
  lineId: string;
  variantId: string;
  quantity: number;
}): Promise<String | undefined> => {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }
  try {
    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity
      }
    ]);
  } catch (e) {
    return 'Error updating item quantity';
  }
};
