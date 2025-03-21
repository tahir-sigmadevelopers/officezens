// src/redux/reducers/auth.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { server } from '../constants';
import toast from 'react-hot-toast';

// Try to initialize state from localStorage if available
const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser;
    }
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  loading: false,
  error: null,
  isAuthenticated: !!getUserFromStorage(),
};

// Async action to handle signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${server}/api/v1/user/register`, userData);
      if (data.success) {
        return data;
      } else {
        return rejectWithValue({
          message: data.message || 'Signup failed'
        });
      }
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

// Get user data (for checking if token is valid)
export const getUser = createAsyncThunk(
  'auth/getUser',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching user data');
    }
  }
);

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
      localStorage.removeItem('user');
    },
    // Sync Redux state with localStorage
    syncWithStorage: (state) => {
      const storedUser = getUserFromStorage();
      state.user = storedUser;
      state.isAuthenticated = !!storedUser;
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
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || 'Signup failed');
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
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem('user');
        }
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
      });
  },
});

export const { logout, userExist, userNotExist, syncWithStorage } = authSlice.actions;

export default authSlice.reducer;
