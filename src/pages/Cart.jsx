// CartPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

const CartPage = () => {
    const dispatch = useDispatch();
    const { product } = useSelector((state) => state.productDetails);
    const { cartItems } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const increaseCart = (id, quantity, stock) => {
        if (stock <= quantity) return;
        let qty = quantity + 1;
        dispatch(addToCart(id, qty));
    };

    const decreaseCart = (id, quantity) => {
        if (quantity <= 1) return;
        let qty = quantity - 1;
        dispatch(addToCart(id, qty));
    };

    const totalPrice = cartItems.reduce((accumulator, currentItem) => {
        const itemPrice = currentItem.price * currentItem.quantity;
        return accumulator + itemPrice;
    }, 0);

    const navigate = useNavigate();
    const checkOutHandler = () => {
        if (!isAuthenticated) {
            navigate("/login?redirect=shipping");
        } else {
            navigate("/shipping");
        }
    };

    const removeFromCartHandler = (id) => {
        // dispatch(removeFromCart(id));
        localStorage.removeItem("cartItems")
        toast.success("Item Removed From Cart");
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen mt-6 md:mt-10">
            {/* Page Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1 md:mb-2">Your Shopping</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-8">Home / My Cart</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Empty Cart Message */}
                {
                    cartItems.length < 1 && (
                        <div className='flex lg:col-span-2 flex-col gap-4 md:gap-8 justify-center items-center py-12'>
                            <h3 className='text-xl md:text-3xl lg:col-span-2'>No Items In Cart</h3>
                            <Link to="/products" className="py-2 md:py-3 px-4 md:px-6 bg-yellow-500 text-white text-sm md:text-base rounded-lg hover:bg-yellow-400 transition-colors">Continue Shopping</Link>
                        </div>
                    )
                }
                
                {/* Cart Items Section */}
                {
                    cartItems.length > 0 && (
                        <div className="lg:col-span-2 bg-white shadow-sm rounded-lg p-4 md:p-6">
                            <div className="hidden sm:flex justify-between border-b pb-3 mb-4">
                                <span className="text-base md:text-lg font-semibold w-2/3">Items</span>
                                <span className="text-base md:text-lg font-semibold w-1/3 text-right">Price</span>
                            </div>

                            {/* Individual Cart Item */}
                            {cartItems && cartItems?.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b last:border-0">
                                    {/* Item Info - Mobile Layout */}
                                    <div className="flex items-start sm:items-center space-x-3 md:space-x-4 mb-3 sm:mb-0 sm:w-2/3">
                                        <img
                                            src={item?.image}
                                            alt="Product"
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg md:text-xl font-semibold truncate max-w-[200px] md:max-w-[300px]">{item.name}</h3>
                                            <p className="text-xs md:text-sm text-gray-500 hidden md:block line-clamp-2">{item.description}</p>
                                            
                                            {/* Price on mobile */}
                                            <p className="text-sm font-semibold text-gray-700 mt-1 sm:hidden">
                                                Rs. {item.price.toFixed(2)} × {item.quantity} = Rs. {(item.quantity * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Controls - Mobile & Desktop */}
                                    <div className="flex items-center justify-between sm:justify-end sm:space-x-4 sm:w-1/3">
                                        <div className="flex items-center space-x-2 sm:space-x-4">
                                            {/* Delete Button */}
                                            <button 
                                                onClick={removeFromCartHandler}
                                                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <img
                                                    src="/trash.png"
                                                    alt="Delete"
                                                    className="w-5 h-5 md:w-6 md:h-6"
                                                />
                                            </button>
                                            
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border rounded-lg">
                                                <button 
                                                    onClick={() => decreaseCart(item.id, item.quantity)} 
                                                    className="px-2 md:px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    className="w-8 md:w-12 text-center border-l border-r outline-none bg-gray-50 text-sm md:text-base"
                                                    readOnly
                                                />
                                                <button 
                                                    onClick={() => increaseCart(item.id, item.quantity, item.stock)}
                                                    className="px-2 md:px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Price - Desktop only */}
                                        <span className="hidden sm:block text-base md:text-lg font-semibold text-gray-700 text-right">
                                            Rs. {(item.quantity * item.price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }

                {/* Order Summary Section */}
                {cartItems.length > 0 && (
                    <div className="bg-white p-4 md:p-6 shadow-sm rounded-lg mt-4 lg:mt-0">
                        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Order Summary</h3>
                        <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>Rs. {totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>{totalPrice > 10000 ? `Rs. 500.00` : "Free"}</span>
                            </div>
                            
                            <div className="flex justify-between font-semibold text-base md:text-lg pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>Rs. {(totalPrice > 10000 ? totalPrice + 500 : totalPrice).toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 md:mt-6 space-y-3">
                            <button
                                onClick={checkOutHandler}
                                className="w-full bg-black hover:opacity-85 text-white py-2 md:py-3 rounded-lg text-sm md:text-base transition-opacity"
                            >
                                Go to Checkout
                            </button>
                            <Link to="/products" className="block w-full border hover:bg-gray-100 border-gray-300 text-gray-700 py-2 md:py-3 rounded-lg text-center text-sm md:text-base transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
