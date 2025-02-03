
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from './constants';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/product` }),
  endpoints: (builder) => ({
    searchProducts: builder.query({
      query: ({ price, category, subCategory, page, search, sort }) => {
        let base = `all?page=${page}`;
        if (search) base += `&search=${encodeURIComponent(search)}`;
        if (price) base += `&price=${price}`;
        if (category) base += `&category=${encodeURIComponent(category.trim())}`; // Trim category
        if (subCategory) base += `&subCategory=${encodeURIComponent(subCategory.trim())}`; // Trim subCategory
        if (sort) base += `&sort=${sort}`;
        return base;
      },
      providesTags: ["product"]
    })
  })
});

export const { useSearchProductsQuery } = productsApi;
