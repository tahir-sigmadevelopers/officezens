import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from '../redux/actions/orderAction';
import toast from "react-hot-toast";

const PaymentMethodSelection = () => {
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const orderInfo = JSON.parse(sessionStorage.getItem("confirmOrder")) || {};
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        tax: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        total: orderInfo.totalPrice
    };

    const handleContinue = () => {
        if (paymentMethod === "stripe") {
            navigate("/payment/process");
        } else if (paymentMethod === "cod") {
            // For cash on delivery
            order.paymentInfo = {
                id: "COD_" + Date.now(),
                status: "Cash on Delivery",
            };

            try {
                dispatch(createOrder(order));
                toast.success("Order Placed Successfully");
                localStorage.removeItem("cartItems");
                navigate("/success?method=cod");
            } catch (error) {
                toast.error("Failed to place order");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 p-3 md:p-4 py-16 md:py-20">
            <div className="w-full max-w-md md:max-w-lg p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md md:shadow-lg space-y-4 md:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold md:font-extrabold text-center text-gray-800">Select Payment Method</h2>
                
                <div className="space-y-3 md:space-y-2">
                    <div 
                        className="flex items-center space-x-2 md:space-x-3 p-2 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setPaymentMethod("cod")}
                    >
                        <input
                            type="radio"
                            name="payment-method"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            className="h-4 w-4 md:h-5 md:w-5 text-yellow-500"
                        />
                        <div>
                            <h3 className="text-sm md:text-base font-semibold">Cash on Delivery</h3>
                            <p className="text-xs md:text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                    </div>

                    {/* <div 
                        className="flex items-center space-x-2 md:space-x-3 p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50"
                    >
                        <input
                            type="radio"
                            name="payment-method"
                            disabled
                            className="h-4 w-4 md:h-5 md:w-5 text-yellow-500"
                        />
                        <div>
                            <h3 className="text-sm md:text-base font-semibold">Card Payment (Coming Soon)</h3>
                            <p className="text-xs md:text-sm text-gray-600">Pay securely with your credit/debit card</p>
                        </div>
                    </div> */}
                </div>
                
                <div className="pt-3 md:pt-4">
                    <button
                        onClick={handleContinue}
                        className="w-full py-2 md:py-3 text-white bg-yellow-500 rounded-md font-medium md:font-semibold text-sm md:text-lg shadow-md hover:bg-yellow-600 hover:shadow-lg transition duration-300"
                    >
                        Continue with {paymentMethod === "cod" ? "Cash on Delivery" : "Payment"}
                    </button>
                </div>
                
                <div className="pt-2 md:pt-4 text-center">
                    <p className="text-gray-600 text-xs md:text-sm">
                        {paymentMethod === "cod" ? 
                        "You will pay for this order when it is delivered to your shipping address." :
                        "You will be redirected to our secure payment gateway to complete your purchase."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodSelection; 