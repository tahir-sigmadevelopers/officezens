import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from '../redux/actions/orderAction';
import { clearCart } from '../redux/actions/cartActions';
import toast from "react-hot-toast";

const PaymentMethodSelection = () => {
    const [guestEmail, setGuestEmail] = useState("");
    const orderInfo = JSON.parse(sessionStorage.getItem("confirmOrder")) || {};
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Basic email validation
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        tax: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        total: orderInfo.totalPrice,
        user: user?._id,
        guestInfo: !isAuthenticated ? { email: guestEmail } : undefined
    };

    const handleContinue = () => {
        // If not logged in, validate email
        if (!isAuthenticated && (!guestEmail || !isValidEmail(guestEmail))) {
            toast.error("Please enter a valid email address to continue");
            return;
        }

        // For cash on delivery
        order.paymentInfo = {
            id: "COD_" + Date.now(),
            status: "Cash on Delivery",
        };

        try {
            dispatch(createOrder(order));
            // Clear cart using the dedicated action
            dispatch(clearCart());
            toast.success("Order Placed Successfully");
            navigate("/success?method=cod");
        } catch (error) {
            toast.error("Failed to place order");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 p-3 md:p-4 py-16 md:py-20">
            <div className="w-full max-w-md md:max-w-lg p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md md:shadow-lg space-y-4 md:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold md:font-extrabold text-center text-gray-800">Cash on Delivery</h2>
                
                {/* Show email input for guest checkout */}
                {!isAuthenticated && (
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address (for order confirmation)
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="your@email.com"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            required
                        />
                    </div>
                )}
                
                <div className="space-y-3 md:space-y-2">
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-base font-semibold mb-2">Payment Details</h3>
                        <p className="text-sm text-gray-600">You will pay for this order when it is delivered to your shipping address.</p>
                    </div>
                </div>
                
                <div className="pt-3 md:pt-4">
                    <button
                        onClick={handleContinue}
                        className="w-full py-2 md:py-3 text-white bg-yellow-500 rounded-md font-medium md:font-semibold text-sm md:text-lg shadow-md hover:bg-yellow-600 hover:shadow-lg transition duration-300"
                    >
                        Place Order
                    </button>
                </div>
                
                <div className="pt-2 md:pt-4 text-center">
                    <p className="text-gray-600 text-xs md:text-sm">
                        You will pay for this order when it is delivered to your shipping address.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodSelection; 