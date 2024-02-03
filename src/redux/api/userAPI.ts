import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { allUsersResponse, messageResponse, userResponse } from "../../types/api_types";
import { User, deleteUser } from "../../types/types";
import axios from "axios";

export const userApi = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user`}),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        login: builder.mutation<messageResponse,User>({
            query: (user)=> ({
                url: "new",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation<messageResponse,deleteUser>({
            query: ({user_Id, admin_Id})=> ({
                url: `${user_Id}?id=${admin_Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
        allUsers: builder.query<allUsersResponse,string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["User"],
        })
    }),
});

export const getUser =async (id:string) => {
    try {
        const {data}: {data: userResponse} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);

        return data;
    } catch (error) {
        throw error;
    }
}

export const {useLoginMutation, useAllUsersQuery, useDeleteUserMutation} = userApi;