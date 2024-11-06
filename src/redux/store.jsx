// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import productsReducer from './reducers/products';
import cartReducer from './reducers/cart';
import productDetailsReducer from './reducers/product-details';
import { productsApi } from './productsApi';
import { orderReducer } from './reducers/ordersReducer';


const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    productDetails: productDetailsReducer,
    orders: orderReducer,
    [productsApi.reducerPath]: productsApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export default store;
