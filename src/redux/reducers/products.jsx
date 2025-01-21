// src/redux/slices/productsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { server } from '../constants';


export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${server}/api/v1/product/${id}`);
            return { message: response.data.message, productId: id }; // Return both message and productId
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to delete product');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, data }, { rejectWithValue }) => { // Combine id and data into an object
        try {

            const response = await axios.put(`${server}/api/v1/product/${id}`, data);

            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to Update Product');
        }
    }
);


export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${server}/api/v1/product/new`,
                productData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log("main response hoon", response.data);

            return response.data.product;
        } catch (error) {
            console.log('main error: ' + error);

            return rejectWithValue(error?.response?.data?.message || 'Failed to create product');
        }
    }
);




// Thunk to fetch latest products from backend
export const fetchLatestProducts = createAsyncThunk(
    'products/fetchLatestProducts', // Updated action type
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${server}/api/v1/product/latest`);
            return response.data.latestProducts;
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to fetch latest products');
        }
    }
);

// Thunk to fetch old products from backend
export const fetchOldProducts = createAsyncThunk(
    'products/fetchOldProducts', // Updated action type
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${server}/api/v1/product/old`);
            return response.data.oldProducts;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch latest products');
        }
    }
);

export const fetchAllCategories = createAsyncThunk(
    'products/fetchAllCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${server}/api/v1/product/allcategories`);
            console.log('main categories hoon', response.data.allCategories);

            return response.data.allCategories;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch latest products');
        }
    }
);

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${server}/api/v1/product/all`);
            return response.data.products;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch all products');
        }
    }
);


export const addCategory = createAsyncThunk(
    'products/addCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${server}/api/v1/product/new/category`,
                categoryData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            return response.data.category;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to create Category');
        }
    }
);


const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        latestItems: [],
        oldItems: [],
        allCategories: [],
        loading: false,
        latestLoading: false,
        oldLoading: false,
        error: null,
        latestError: null,
        oldError: null,
        createLoading: false,
        deleteLoading: false,
        allCategoriesLoading: false,
        updateLoading: false,
        createError: null,
        deleteError: null,
        updateError: null,
        allCategoriesError: null,
        message: null,
    },
    reducers: {
        // Optionally, add reducers here if you need additional product-related actions
    },
    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch latest products
            .addCase(fetchLatestProducts.pending, (state) => {
                state.latestLoading = true;
                state.latestError = null;
            })
            .addCase(fetchLatestProducts.fulfilled, (state, action) => {
                state.latestLoading = false;
                state.latestItems = action.payload;
            })
            .addCase(fetchLatestProducts.rejected, (state, action) => {
                state.latestLoading = false;
                state.latestError = action.payload;
            })

            // Fetch old products
            .addCase(fetchOldProducts.pending, (state) => {
                state.oldLoading = true;
                state.oldError = null;
            })
            .addCase(fetchOldProducts.fulfilled, (state, action) => {
                state.oldLoading = false;
                state.oldItems = action.payload;
            })
            .addCase(fetchOldProducts.rejected, (state, action) => {
                state.oldLoading = false;
                state.oldError = action.payload;
            })

            // Create product
            .addCase(createProduct.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.createLoading = false;
                state.message = action.payload.message; // Assuming the payload has a message
                state.items.push(action.payload.product); // Add new product to the list
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })

            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.message = action.payload.message;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.message = action.payload.message; // Assuming the payload has a message
                const index = state.items.findIndex(
                    (product) => product.id === action.payload.product.id
                );
                if (index !== -1) {
                    state.items[index] = action.payload.product;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            })

            // getAllCategories
            .addCase(fetchAllCategories.pending, (state) => {
                state.allCategoriesLoading = true;
                state.allCategoriesError = null;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.allCategoriesLoading = false;
                state.allCategories = action.payload;
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.allCategoriesLoading = false;
                state.allCategoriesError = action.payload;
            })

            // Add Category
            .addCase(addCategory.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.createLoading = false;
                state.message = action.payload?.message || 'Category Added successfully';
                state.category = action.payload.category;
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload || 'Error adding category';
            })
    },
});

export default productsSlice.reducer;
