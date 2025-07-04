import axios from "axios";
import { server } from "../constants";

export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: "createOrderRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const { data } = await axios.post(`${server}/api/v1/order/new`, orderData, config);

    dispatch({
      type: "createOrderSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "createOrderFail",
      payload: error.response?.data.message || "Order creation failed",
    });
  }
};

export const getMyOrders = (guestEmail) => async (dispatch) => {
  try {
    dispatch({
      type: "myOrdersRequest",
    });

    const url = guestEmail
      ? `${server}/api/v1/order/my?email=${encodeURIComponent(guestEmail)}`
      : `${server}/api/v1/order/my`;

    const { data } = await axios.get(url, {
      withCredentials: true,
    });

    dispatch({
      type: "myOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "myOrdersFail",
      payload: error.response?.data?.message || "Failed to fetch orders",
    });
  }
};

export const getAdminOrders = () => async (dispatch) => {
  try {
    dispatch({ type: "adminOrderRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const { data } = await axios.get(`${server}/api/v1/order/all`, config);


    dispatch({
      type: "adminOrderSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "adminOrderFail",
      payload: error.response?.data.message || "Order Fetching failed",
    });
  }
};

export const getOrderDetails = (id, email) => async (dispatch) => {
  try {
    dispatch({ type: "orderDetailsRequest" });

    const url = email
      ? `${server}/api/v1/order/${id}?email=${encodeURIComponent(email)}`
      : `${server}/api/v1/order/${id}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const { data } = await axios.get(url, config);

    dispatch({
      type: "orderDetailsSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "orderDetailsFail",
      payload: error.response?.data.message || "Order Fetching failed",
    });
  }
};

export const updateOrder = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "updateOrderRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    
    // Send an empty object as the request body instead of sending the config as the body
    const { data } = await axios.put(`${server}/api/v1/order/${orderId}`, {}, config);

    dispatch({
      type: "updateOrderSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "updateOrderFail",
      payload: error.response?.data.message || "Order Updating failed",
    });
  }
};

export const deleteOrder = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "deleteOrderRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const { data } = await axios.delete(`${server}/api/v1/order/${orderId}`, config);

    dispatch({
      type: "deleteOrderSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "deleteOrderFail",
      payload: error.response?.data.message || "Order Deletion failed",
    });
  }
};

export const clearMessage = () => (dispatch) => {
  dispatch({ type: "clearMessage" });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: "clearError" });
};
