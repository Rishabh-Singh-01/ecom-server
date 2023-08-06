import { CartItemInterface } from '../model/cartItem';

interface HelperCartDataInterface {
  cart_items: CartItemInterface[];
}

export const isValidCartItemsDataForOrder = (
  cartItemsData: any
): cartItemsData is HelperCartDataInterface => {
  if (
    !(
      typeof cartItemsData === 'object' &&
      cartItemsData !== null &&
      cartItemsData.hasOwnProperty('cart_items') &&
      Array.isArray(cartItemsData.cart_items)
    )
  )
    return false;

  const repeatedProductChecker = new Map<string, number>();
  cartItemsData.cart_items.forEach((cartItem: CartItemInterface) => {
    if (
      !(
        typeof cartItem === 'object' &&
        cartItem !== null &&
        cartItem.hasOwnProperty('productId') &&
        cartItem.hasOwnProperty('quantity') &&
        cartItem.hasOwnProperty('size')
      )
    )
      return false;

    if (
      !cartItem.productId ||
      typeof cartItem.productId !== 'string' ||
      !cartItem.quantity ||
      cartItem.quantity <= 0 ||
      typeof cartItem.quantity !== 'number' ||
      !cartItem.size ||
      typeof cartItem.size !== 'string'
    )
      return false;

    if (
      cartItem.size !== 'S' &&
      cartItem.size !== 'M' &&
      cartItem.size !== 'L' &&
      cartItem.size !== 'XL' &&
      cartItem.size !== 'XXL'
    )
      return false;

    // to make sure we dont have same product variation more than one time
    if (
      repeatedProductChecker.get(`${cartItem.productId}#${cartItem.size}`) !== 1
    )
      return false;
    else
      repeatedProductChecker.set(`${cartItem.productId}#${cartItem.size}`, 1);
  });

  return true;
};
