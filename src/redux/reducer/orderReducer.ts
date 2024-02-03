import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shippingInfo: {
        address: "",
        pincode: "",
        state: "",
        city: "",
        country: "",
    },
    user: "",
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    orderItems: [
        {
            name: "",
            photo: "",
            price: 0,
            quantity: 0,
            productId: ""
        }
    ]
}


export const orderReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        
    }
})