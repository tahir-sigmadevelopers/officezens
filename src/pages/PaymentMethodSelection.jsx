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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg space-y-6">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">Select Payment Method</h2>
                
                <div className="space-y-4">
              
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                         onClick={() => setPaymentMethod("cod")}>
                        <input
                            type="radio"
                            name="payment-method"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            className="h-5 w-5 text-yellow-500"
                        />
                        <div>
                            <h3 className="font-semibold">Cash on Delivery</h3>
                            <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                    </div>
                </div>
                
                <div className="pt-4">
                    <button
                        onClick={handleContinue}
                        className="w-full py-3 text-white bg-yellow-500 rounded-md font-semibold text-lg shadow-md hover:bg-yellow-600 hover:shadow-lg transition duration-300"
                    >
                        Continue
                    </button>
                </div>
                
                <div className="pt-4 text-center">
                    <p className="text-gray-600 text-sm">
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