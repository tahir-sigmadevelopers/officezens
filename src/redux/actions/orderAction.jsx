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
    console.log('main data hoon, going to backend', orderData);
    const { data } = await axios.post(`${server}/order/new`, orderData, config);

    console.log('main data hoon, coming from backend', data);

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

export const clearMessage = () => (dispatch) => {
  dispatch({ type: "clearMessage" });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: "clearError" });
};
