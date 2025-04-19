import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const OrderSummary = () => {

    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);

    // Ensure shippingInfo is available
    if (!shippingInfo || !shippingInfo.address) {
        navigate("/shipping");
        return null;
    }

    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

    const subtotal = cartItems.reduce((accumulator, currentItem) => {
        const itemPrice = currentItem.price * currentItem.quantity;
        return accumulator + itemPrice;
    }, 0);

    const shippingCharges = 500;

    const tax = subtotal * 0.18;

    const totalPrice = subtotal + shippingCharges + tax;

    const proceedToPayment = async (e) => {
        e.preventDefault();

        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice,
        };
        sessionStorage.setItem("confirmOrder", JSON.stringify(data));
        navigate("/payment-method")
    };

    return (
        <div className="flex flex-col md:flex-row md:space-x-4 p-4 py-16 sm:p-6 md:p-10 mt-4 md:mt-0 md:py-16">
            {/* Left Side: Shipping Info and Cart Items */}
            <div className="w-full md:w-2/3 px-3 md:px-6 space-y-6 md:space-y-8 mb-6 md:mb-0">
                {/* Shipping Info */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Shipping Info</h2>
                    <div className="text-sm md:text-base text-gray-700">
                        {user && <p><strong>Name:</strong> {user.name}</p>}
                        <p><strong>Phone:</strong> {shippingInfo.phoneNo}</p>
                        <p><strong>Address:</strong> {address}</p>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Your Cart Items:</h2>
                    <div className="space-y-3 md:space-y-4">
                        {
                            cartItems &&
                            cartItems.map((item) => (
                                <div className="flex flex-col sm:flex-row sm:items-center border-b pb-3 last:border-0" key={item.id}>
                                    <div className="flex items-start sm:items-center mb-2 sm:mb-0 sm:w-2/3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded mr-3 md:mr-4"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm md:text-base font-semibold truncate max-w-[180px] sm:max-w-[300px] lg:max-w-[400px]">
                                                <Link to={`/product/${item.id}`} className="hover:text-yellow-600 transition-colors">{item.name}</Link>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs md:text-sm text-gray-600 ml-0 sm:ml-auto sm:w-1/3 sm:text-right"> 
                                        {item.quantity} X Rs.{item.price.toFixed(2)} = {" "}
                                        <b className="text-gray-900">Rs. {(item.price * item.quantity).toFixed(2)}</b>
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="w-full md:w-1/3 px-3 md:px-6 border border-gray-200 p-4 md:p-6 rounded-lg bg-white shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm md:text-base text-gray-700">
                    <div className="flex justify-between">
                        <p>Subtotal:</p>
                        <p>Rs. {subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping Charges:</p>
                        <p>Rs. {shippingCharges.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>GST:</p>
                        <p>Rs. {tax.toFixed(2)}</p>
                    </div>
                </div>
                <hr className="my-3 md:my-4" />
                <div className="flex justify-between text-base md:text-xl font-semibold text-gray-900">
                    <p>Total:</p>
                    <p>Rs. {totalPrice.toFixed(2)}</p>
                </div>
                <button 
                    onClick={proceedToPayment} 
                    className="w-full mt-4 md:mt-6 py-2 md:py-3 bg-yellow-500 text-white text-sm md:text-base rounded hover:bg-yellow-600 transition duration-300"
                >
                    Proceed To Payment
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
