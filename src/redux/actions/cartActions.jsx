// src/redux/actions/cartActions.js

import axios from "axios";
import { server } from "../constants";

export const addToCart = (id, quantity) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`${server}/api/v1/product/${id}`);

    dispatch({
      type: "addToCart",
      payload: {
        id: data.product._id,
        name: data.product.name,
        stock: data.product.stock,
        price: data.product.price,
        image: data.product.images[0].url,
        quantity,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  } catch (error) {
    dispatch({ type: "addToCartFail", payload: error.response.data.message });
  }
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`${server}/product/${id}`);

    dispatch({
      type: "removeFromCart",
      payload: data.product._id,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  } catch (error) {
    dispatch({
      type: "removeFromCartFail",
      payload: error.response.data.message,
    });
  }
};

export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: "saveShippingInfo",
    payload: data,
  });

  localStorage.setItem("shippingInfoEcommerce", JSON.stringify(data));
};
