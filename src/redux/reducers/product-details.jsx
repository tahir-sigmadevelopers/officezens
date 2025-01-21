// src/redux/slices/productDetailsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { server } from '../constants';

// Thunk to fetch product details from backend
export const fetchProductDetails = createAsyncThunk(
    'productDetails/fetchProductDetails',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${server}/api/v1/product/${productId}`); // Adjust the URL to your backend endpoint
            return response.data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
        }
    }
);

const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState: {
        product: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: You can add additional reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productDetailsSlice.reducer;
