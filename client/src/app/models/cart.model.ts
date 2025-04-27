export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
    imageUrl: string;
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    isCustom?: boolean;
}

export interface CheckoutModel {
    cart: Cart;
    coupon: Coupon[];
}

export interface Coupon {
    code: string;
    amount: number;
    isPercent: boolean;
    category: string;
}