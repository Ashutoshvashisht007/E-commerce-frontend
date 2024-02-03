import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { allCategoryResponse, allProductResponse, deleteProductRequest, messageResponse, newProductRequest, prodcutDetailResponse, searchProductRequest, searchProductResponse, updateProductRequest } from "../../types/api_types";

export const productAPI = createApi({
    reducerPath: "productAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
    }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<allProductResponse, string>({
            query: () => "latest",
            providesTags: ["product"],
        }),
        allProducts: builder.query<allProductResponse, string>({
            query: (id) => `admin-products?id=${id}`,
            providesTags: ["product"],
        }),
        allCategories: builder.query<allCategoryResponse, string>({
            query: () => `categories`,
            providesTags: ["product"],
        }),
        searchProducts: builder.query<searchProductResponse, searchProductRequest>({
            query: ({ search, sort, page, price, category }) => {

                let base = `all?search=${search}&page=${page}`;

                if (price) {
                    base += `&price=${price}`;
                }
                if (sort) {
                    base += `&sort=${sort}`;
                }
                if (category) {
                    base += `&category=${category}`;
                }

                return base;
            },
            providesTags: ["product"],
        }),
        productDetail: builder.query<prodcutDetailResponse, string>({
            query: (id) => id,
            providesTags: ["product"],
        }),
        updateProductDetail: builder.mutation<messageResponse, updateProductRequest>({
            query: ({ product_id, user_id, formData }) => ({
                url: `${product_id}?id=${user_id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["product"],
        }),
        deleteProduct: builder.mutation<messageResponse, deleteProductRequest>({
            query: ({ product_id, user_id }) => ({
                url: `${product_id}?id=${user_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"],
        }),
        createNewProducts: builder.mutation<messageResponse, newProductRequest>({
            query: ({ id, formData }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["product"]
        }),
    })
});

export const { useLatestProductsQuery, useAllProductsQuery, useAllCategoriesQuery, useSearchProductsQuery, useProductDetailQuery, useUpdateProductDetailMutation, useDeleteProductMutation, useCreateNewProductsMutation } = productAPI;