import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { server } from "../redux/constants";
import toast from "react-hot-toast";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios";
import { createOrder } from '../redux/actions/orderAction'
import { loadStripe } from "@stripe/stripe-js";
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";


const stripePromise = loadStripe("pk_test_51Q5piL2Nm6JjFT3FD0Q7q3HDUMq7FVVyKGyaVdaxkYDYcBhyQR5ZMQvoQOfoQ6XQIJnp4TOHR4kkAJP3JBDasYB300J4s1qlm8")

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
        // user: user._id
    };

    // console.log(order);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        payBtn.current.disabled = true;

        try {
            const result = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
            });

            if (result.error) {
                payBtn.current.disabled = false;
                toast.error(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                };

                toast.success("Order Placed Successfully");
                localStorage.removeItem("cartItems");
                dispatch(createOrder(order));
                navigate("/success");
            } else {
                toast.error("There's an issue processing your payment.");
            }
        } catch (error) {
            payBtn.current.disabled = false;
            console.log(error);
            toast.error(error?.response?.data?.message || "Payment failed");
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
        <form
            onSubmit={submitHandler}
            className="flex items-center justify-center min-h-screen bg-gray-50 p-4"
        >
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg space-y-6">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">Payment Information</h2>

                {/* Payment Element */}
                <div className="border border-gray-300 rounded-md p-4 focus-within:ring-2 focus-within:ring-yellow-500">
                    <PaymentElement />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    ref={payBtn}
                    className="w-full py-3 text-white bg-yellow-500 rounded-md font-semibold text-lg shadow-md hover:bg-yellow-600 hover:shadow-lg transition duration-300"
                >
                    Pay Securely
                </button>
            </div>
        </form>


    );
};








const CheckOut = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState(null);
    const orderInfo = JSON.parse(sessionStorage.getItem("confirmOrder")) || {};


    useEffect(() => {
        // Fetch clientSecret if not provided in location.state
        const fetchClientSecret = async () => {
            try {
                if (!location.state) {
                    const { data } = await axios.post(`${server}/payment/process`, {
                        amount: Math.round(orderInfo?.totalPrice * 100),
                    }, {
                        headers: { "Content-Type": "application/json" }
                    });


                    console.log('main cleint secret', data);

                    setClientSecret(data.client_secret);
                } else {
                    setClientSecret(location.state.clientSecret);
                }
            } catch (error) {
                console.error("Error fetching clientSecret:", error);
                navigate("/shipping"); // Redirect to the shipping page if clientSecret is invalid
            }
        };

        fetchClientSecret();
    }, [location.state, navigate]);

    if (!clientSecret) return <div>Loading...</div>;

    return (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
            <Payment />
        </Elements>
    );
};

export default CheckOut;