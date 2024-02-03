import { User, cartItems, orderItem, shippingInfo } from "./types";

export interface userReducerInitialState {
    user: User | null;
    loading: boolean;
}

export interface cartReducerInitialState {
    loading: boolean;
    cartItems: cartItems[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: shippingInfo;
}

export interface orderReducerInitialState {
    loading: boolean;
    user: string;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: orderItem[];
    shippingInfo: shippingInfo;
    status: string;
}