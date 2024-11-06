// src/redux/reducers/cartReducer.js

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  shippingInfo: localStorage.getItem("shippingInfoEcommerce")
    ? JSON.parse(localStorage.getItem("shippingInfoEcommerce"))
    : {},
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "addToCart":
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.id === isItemExist.id ? item : cartItem
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case "addToCartFail":
      return {
        ...state,
        error: action.payload,
      };

    case "removeFromCart":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload
        ),
      };

    case "removeFromCartFail":
      return {
        ...state,
        error: action.payload,
      };

    case "saveShippingInfo":
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};


export default cartReducer;