import { createReducer } from "@reduxjs/toolkit";

export const orderReducer = createReducer(
  { state: {}, loading: false, message: null, error: null },
  (builder) => {
    builder
      .addCase("createOrderRequest", (state) => {
        state.loading = true;
      })
      .addCase("createOrderSuccess", (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase("createOrderFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("adminOrderRequest", (state) => {
        state.loading = true;
      })
      .addCase("adminOrderSuccess", (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase("adminOrderFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("orderDetailsRequest", (state) => {
        state.loading = true;
      })
      .addCase("orderDetailsSuccess", (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase("orderDetailsFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("updateOrderRequest", (state) => {
        state.loading = true;
      })
      .addCase("updateOrderSuccess", (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase("updateOrderFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("clearMessage", (state) => {
        state.message = null;
      })
      .addCase("clearError", (state) => {
        state.error = null;
      });
  }
);

export const myOrdersReducer = createReducer(
  { orders: [], loading: false, message: null, error: null },
  (builder) => {
    builder
      .addCase("getMyOrdersRequest", (state) => {
        state.loading = true;
      })
      .addCase("getMyOrdersSuccess", (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase("getMyOrdersFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("clearMessage", (state) => {
        state.message = null;
      })
      .addCase("clearError", (state) => {
        state.error = null;
      });
  }
);
