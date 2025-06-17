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
        state.ordersCount = action.payload.ordersCount;
        state.totalAmount = action.payload.totalAmount;
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
        state.order = action.payload;
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
      .addCase("deleteOrderRequest", (state) => {
        state.loading = true;
      })
      .addCase("deleteOrderSuccess", (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase("deleteOrderFail", (state, action) => {
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
      .addCase("myOrdersRequest", (state) => {
        state.loading = true;
      })
      .addCase("myOrdersSuccess", (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase("myOrdersFail", (state, action) => {
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
