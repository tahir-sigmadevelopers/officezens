// src/redux/api/productsApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from './constants';

// Define the API slice for products
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/product` }), // replace with your actual backend URL
  endpoints: (builder) => ({
    searchProducts: builder.query({
      query: ({ price, category, page, search, sort }) => {
        let base = `all?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (category) base += `&category=${category}`;
        if (sort) base += `&sort=${sort}`;
        return base;
      },
      providesTags: ["product"]
    })
  })
});

export const { useSearchProductsQuery } = productsApi;
