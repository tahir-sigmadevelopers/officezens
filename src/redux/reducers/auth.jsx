// src/redux/reducers/auth.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { server } from '../constants';
import toast from 'react-hot-toast';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async action to handle signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${server}/api/v1/user/register`, userData); // Signup API endpoint
      toast.success(data.message)

      return data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error during signup');
    }
  }
);

// Async action to handle login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`, credentials);
      if (data.success) {
        toast.success(data.message || 'Login successful');
        return data;
      } else {
        return rejectWithValue({
          message: data.message || 'Login failed'
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      return rejectWithValue({
        message: errorMessage
      });
    }
  }
);


export const getUser = async (id) => {
  try {
    const { data } = await axios.get(`${server}/api/v1/user/${id}`)

    return data;

  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error during Get User');
  }
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    userExist: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    userNotExist: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload)); // Save user data on signup success
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.user = null;
        state.isAuthenticated = false;
      });
  },

});

export const { logout, userExist, userNotExist } = authSlice.actions;

export default authSlice.reducer;
