import { Coupon } from "./coupon.model";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
    imageUrl: string;
    category: string;
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
}

export interface CheckoutModel {
    cart: Cart;
    coupon: Coupon[];
}

