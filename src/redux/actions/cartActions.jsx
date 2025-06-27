// src/redux/actions/cartActions.js

import axios from "axios";
import { server } from "../constants";

export const addToCart = (id, quantity, selectedVariation = null) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`${server}/api/v1/product/${id}`);
    
    if (!data || !data.product) {
      throw new Error("Product data not found");
    }

    const cartItem = {
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
    };

    dispatch({
      type: "addToCart",
      payload: cartItem,
    });

    // Save to localStorage after dispatch
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
    
    console.log("Cart updated:", getState().cart.cartItems);
    
    // Return a resolved promise with the cart item
    return Promise.resolve(cartItem);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to add item to cart";
    dispatch({ type: "addToCartFail", payload: errorMessage });
    return Promise.reject(error);
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

export const clearCart = () => (dispatch) => {
  dispatch({ type: "clearCart" });
  localStorage.removeItem("cartItems");
};
