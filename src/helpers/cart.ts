import { ICartItem } from "../interfaces";

const calculateTotalPrice = (cartItems: ICartItem[]) => {
  return cartItems.reduce((total, cartItem) => {
    const { quantity, selectedProductSize } = cartItem;
    const itemTotal = quantity * selectedProductSize.price;
    return total + itemTotal;
  }, 0);
};

export { calculateTotalPrice };
