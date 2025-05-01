// src/redux/actions/cartActions.js

import axios from "axios";
import { server } from "../constants";

export const addToCart = (id, quantity, selectedVariation = null) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`${server}/api/v1/product/${id}`);

    dispatch({
      type: "addToCart",
      payload: {
        id: data.product._id,
        name: data.product.name,
        stock: data.product.stock,
        price: selectedVariation?.price || data.product.price,
        image: selectedVariation?.image?.url || data.product.images[0].url,
        quantity,
        variation: selectedVariation ? {
          name: selectedVariation.name,
          color: selectedVariation.color || null,
          image: selectedVariation.image || null
        } : null
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
    dispatch({
      type: "removeFromCart",
      payload: id,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  } catch (error) {
    dispatch({
      type: "removeFromCartFail",
      payload: error.response?.data?.message || "Failed to remove item",
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
