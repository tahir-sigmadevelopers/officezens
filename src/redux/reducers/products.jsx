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
export const deleteCategory = createAsyncThunk(
    'products/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${server}/api/v1/product/delete/category/${id}`);
            return { message: response.data.message, categoryId: id }; // Return both message and categoryId
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to delete Category ' + categoryId);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            console.log("data", data);
            const response = await axios.put(`${server}/api/v1/product/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 60000
            });
            console.log("response", response);

            if (response.data.success) {
                return {
                    message: response.data.message || "Product updated successfully",
                    product: response.data.product
                };
            } else {
                return rejectWithValue(response.data.message || "Failed to update product");
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                return rejectWithValue('Request timed out. Image upload may be too large or connection is slow.');
            }
            
            const errorMessage = error.response?.data?.message || 'Failed to update product';
            return rejectWithValue(errorMessage);
        }
    }
);


export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            console.log("product Data", productData);

            const response = await axios.post(
                `${server}/api/v1/product/new`,
                productData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 60000
                }
            );
            
            if (response.data.success) {
                return {
                    message: "Product created successfully!",
                    product: response.data.product
                };
            } else {
                return rejectWithValue(response.data.message || "Failed to create product");
            }
        } catch (error) {
            console.log('main error: ', error);
            
            if (error.code === 'ECONNABORTED') {
                return rejectWithValue('Request timed out. Image upload may be too large or connection is slow.');
            }
            
            const errorMessage = error.response?.data?.message || 'Failed to create product';
            return rejectWithValue(errorMessage);
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
        clearMessage: null,
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.createError = null;
            state.updateError = null;
            state.deleteError = null;
            state.allCategoriesError = null;
        },
        clearMessage: (state) => {
            state.message = null;
        }
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
                state.message = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.createLoading = false;
                state.message = action.payload.message;
                if (action.payload.product) {
                    state.items = [...state.items, action.payload.product];
                }
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
            // Delete Category
            .addCase(deleteCategory.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.message = action.payload.message;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
                state.message = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.message = action.payload.message;
                
                if (action.payload.product) {
                    const index = state.items.findIndex(item => item._id === action.payload.product._id);
                    if (index !== -1) {
                        state.items[index] = action.payload.product;
                    }
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
