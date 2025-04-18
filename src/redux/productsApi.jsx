import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from './constants';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/product` }),
  tagTypes: ['Products', 'LatestProducts', 'OldProducts', 'Categories'],
  keepUnusedDataFor: 300, // Keep unused data in cache for 5 minutes (300 seconds)
  endpoints: (builder) => ({
    searchProducts: builder.query({
      query: ({ price, category, subCategory, page, search, sort }) => {
        let base = `all?page=${page}`;
        if (search) base += `&search=${encodeURIComponent(search)}`;
        if (price) base += `&price=${price}`;
        if (category) base += `&category=${encodeURIComponent(category.trim())}`; // Trim category
        if (subCategory) base += `&subCategory=${subCategory}`; // Trim subCategory
        if (sort) base += `&sort=${sort}`;
        return base;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Products', id: _id })),
              { type: 'Products', id: 'LIST' }
            ]
          : [{ type: 'Products', id: 'LIST' }]
    }),
    getLatestProducts: builder.query({
      query: () => 'latest',
      providesTags: [{ type: 'LatestProducts', id: 'LIST' }],
      transformResponse: (response) => response.latestProducts,
    }),
    getOldProducts: builder.query({
      query: () => 'old',
      providesTags: [{ type: 'OldProducts', id: 'LIST' }],
      transformResponse: (response) => response.oldProducts,
    }),
    getCategories: builder.query({
      query: () => 'allcategories',
      providesTags: [{ type: 'Categories', id: 'LIST' }],
      transformResponse: (response) => response.allCategories,
    }),
    getProductDetails: builder.query({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
  })
});

export const { 
  useSearchProductsQuery, 
  useGetLatestProductsQuery, 
  useGetOldProductsQuery, 
  useGetCategoriesQuery,
  useGetProductDetailsQuery,
  useLazySearchProductsQuery 
} = productsApi;
