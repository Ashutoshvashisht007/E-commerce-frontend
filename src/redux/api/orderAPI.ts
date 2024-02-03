import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { messageResponse, newOrderRequest, orderProductResponse, processOrderRequest, singleOrderResponse } from "../../types/api_types";

export const orderAPI = createApi({
    reducerPath: "orderAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
    }),
    tagTypes: ["order"],
    endpoints: (builder) => ({
        newOrder: builder.mutation<messageResponse, newOrderRequest>(
            {
                query: (order) => ({
                    url: "new",
                    method: "POST",
                    body: order,
                }
                ),
                invalidatesTags: ["order"],
            }
        ),
        allOrders: builder.query<orderProductResponse, string>(
            {
                query: (id) => `all?id=${id}`,
                providesTags: ["order"],
            }
        ),
        myOrders: builder.query<orderProductResponse, string>(
            {
                query: (id) => `myOrders?id=${id}`,
                providesTags: ["order"],
            }
        ),
        singleOrder: builder.query<singleOrderResponse, string>(
            {
                query: (id) => `${id}`,
                providesTags: ["order"],
            }
        ),
        processOrder: builder.mutation<messageResponse, processOrderRequest>({
            query: ({ order_id, user_id }) => (
                {
                    url: `${order_id}?id=${user_id}`,
                    method: "PUT"
                }
            ),
            invalidatesTags: ["order"],
        }),
        deleteOrder: builder.mutation<messageResponse, processOrderRequest>({
            query: ({ order_id, user_id }) => (
                {
                    url: `${order_id}?id=${user_id}`,
                    method: "DELETE"
                }
            ),
            invalidatesTags: ["order"],
        }),
    })
});

export const { useNewOrderMutation, useDeleteOrderMutation, useProcessOrderMutation, useAllOrdersQuery, useMyOrdersQuery, useSingleOrderQuery } = orderAPI;