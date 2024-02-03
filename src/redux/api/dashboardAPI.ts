import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { dashboardBarResponse, dashboardLineResponse, dashboardPieResponse, dashboardStatsResponse } from "../../types/api_types";


export const dashboardAPI = createApi({
    reducerPath: "dashboardAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
    }),
    endpoints: (builder) => ({
        dashboardStats: builder.query<dashboardStatsResponse,string>({
            query: (id)=> `stats?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        dashboardPie: builder.query<dashboardPieResponse,string>({
            query: (id)=> `pie?id=${id}`,
            keepUnusedDataFor: 0
        }),
        dashboardBar: builder.query<dashboardBarResponse,string>({
            query: (id)=> `bar?id=${id}`,
            keepUnusedDataFor: 0
        }),
        dashboardLine: builder.query<dashboardLineResponse,string>({
            query: (id)=> `line?id=${id}`,
            keepUnusedDataFor: 0
        }),
    })

});

export const {useDashboardStatsQuery, useDashboardBarQuery, useDashboardLineQuery, useDashboardPieQuery} = dashboardAPI;