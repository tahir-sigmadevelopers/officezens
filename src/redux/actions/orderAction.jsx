import axios from "axios";
import { server } from "../constants";

export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: "createOrderRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(`${server}/order/new`, orderData, config);

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



export const getAdminOrders = () => async (dispatch) => {
  try {
    dispatch({ type: "adminOrderRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(`${server}/order/all`, config);


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

export const getOrderDetails = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "orderDetailsRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(`${server}/order/${orderId}`, config);

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
    };
    const { data } = await axios.put(`${server}/order/${orderId}`, config);

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

export const clearMessage = () => (dispatch) => {
  dispatch({ type: "clearMessage" });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: "clearError" });
};
