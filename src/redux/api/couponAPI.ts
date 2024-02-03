import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { messageResponse, newCouponRequest } from "../../types/api_types";


export const couponAPI = createApi({
    reducerPath: "couponAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/`,
    }),
    tagTypes: ["coupon"],
    endpoints: (builder) => ({
        newCoupon: builder.mutation<messageResponse,newCouponRequest>({
            query: ({id,data})=> ({
                url: `new?id=${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["coupon"],
        })
    })

});

export const {useNewCouponMutation} = couponAPI;
