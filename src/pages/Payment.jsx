import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../redux/constants";
import toast from "react-hot-toast";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from '@stripe/react-stripe-js';
import axios from "axios";
import { createOrder } from '../redux/actions/orderAction'


const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("confirmOrder")) || {};

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { error, message } = useSelector((state) => state.orders);

    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        tax: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        total: orderInfo.totalPrice,
    };

    console.log(order);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (elements == null) {
            return;
        }
        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            };

            const { data } = await axios.post(
                `${server}/payment/process`,
                paymentData,
                config
            );

            const client_secret = data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },
                    },
                },
            });

            
            console.log(`This is the result : ${result.paymentIntent?.status}`);
            if (result.error) {
                payBtn.current.disabled = false;

                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };
                    toast.success("Order Placed Successfully")
                    dispatch(createOrder(order));

                    navigate("/success");
                } else {
                    toast.error("There's some issue while processing payment ");
                }
            }
        } catch (error) {
            payBtn.current.disabled = false;
            console.log(error);

            toast.error(error?.response?.data.message);
        }
    };

    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch({ type: "clearMessage" });
        }
        if (error) {
            toast.error(error);
            dispatch({ type: "clearError" });
        }
    }, [message, error, dispatch]);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-8">Card Info</h2>

                {/* Card Number Input */}
                <div className="mb-6">
                    <label className="flex items-center border border-gray-300 rounded-lg p-3">
                        <svg className="w-6 h-6 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4h12v2H4zM3 7h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm1 2v5h12V9H4z" />
                        </svg>
                        <CardNumberElement className="paymentInput" />

                    </label>
                </div>

                {/* Expiry Date Input */}
                <div className="mb-6">
                    <label className="flex items-center border border-gray-300 rounded-lg p-3">
                        <svg className="w-6 h-6 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zM4 8V4a4 4 0 0 1 8 0v4a4 4 0 0 1-8 0zm10 8H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm-6 2v-2h4v2H8z" />
                        </svg>
                        <CardExpiryElement className="paymentInput" />
                    </label>
                </div>

                {/* CVC Input */}
                <div className="mb-8">
                    <label className="flex items-center border border-gray-300 rounded-lg p-3">
                        <svg className="w-6 h-6 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a2 2 0 0 1 2 2v6h-4V4a2 2 0 0 1 2-2zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm1 6v4a2 2 0 0 1-2 2H7v-6h4z" />
                        </svg>
                        <CardCvcElement className="paymentInput" />
                    </label>
                </div>

                {/* Pay Button */}
                <button
                    ref={payBtn}
                    onClick={submitHandler}
                    className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600">
                    Pay - ₹186440
                </button>
            </div>
        </div>
    );
};

export default Payment;
