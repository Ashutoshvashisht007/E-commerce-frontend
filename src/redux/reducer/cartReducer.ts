import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cartReducerInitialState } from "../../types/reducer_types";
import { cartItems, shippingInfo } from "../../types/types";

const initialState: cartReducerInitialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: ""
    }
};

export const cartReducer = createSlice({
    name: 'cartReducer',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<cartItems>) => {
            state.loading = true;
            const index = state.cartItems.findIndex(i => i.productId === action.payload.productId);

            if (index !== -1) {
                state.cartItems[index] = action.payload;
            }
            else {
                state.cartItems.push(action.payload);
                state.loading = false;
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter((i) => (i.productId !== action.payload));
            state.loading = false;
        },
        calculatePrice: (state) => {
            let subtotal = state.cartItems.reduce(
                (prev, curr) => prev + curr.price * curr.quantity, 0);

            state.subtotal = subtotal;
            state.shippingCharges = (state.subtotal >= 1000 || state.subtotal === 0) ? 0 : 100;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
        },
        applyDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state,action: PayloadAction<shippingInfo>)=>{
            state.shippingInfo = action.payload;
        },
        resetCart: ()=> initialState,
    }
});

export const { addToCart, removeFromCart, calculatePrice, applyDiscount, saveShippingInfo, resetCart } = cartReducer.actions;