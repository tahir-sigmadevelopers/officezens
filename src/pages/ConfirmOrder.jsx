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

    // Format full address for better display
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

    const subtotal = cartItems.reduce((accumulator, currentItem) => {
        const itemPrice = currentItem.price * currentItem.quantity;
        return accumulator + itemPrice;
    }, 0);

    // Shipping charges logic
    const shippingCharges = subtotal > 10000 ? 500 : 0;

    // GST calculation - 5% 
    const tax = subtotal * 0.05;

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
        <div className="flex flex-col md:flex-row md:space-x-4 p-4 py-16 sm:p-6 md:p-10 mt-12 sm:mt-16 md:mt-0 md:py-16">
            {/* Left Side: Shipping Info and Cart Items */}
            <div className="w-full md:w-2/3 px-3 md:px-6 space-y-6 md:space-y-8 mb-6 md:mb-0">
                {/* Shipping Info */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Shipping Info</h2>
                    <div className="text-sm text-gray-700 space-y-2">
                        {user && (
                            <div className="flex">
                                <span className="font-medium w-20">Name:</span>
                                <span>{user.name}</span>
                            </div>
                        )}
                        <div className="flex">
                            <span className="font-medium w-20">Phone:</span>
                            <span>{shippingInfo.phoneNo}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="font-medium w-20">Address:</span>
                            <span className="flex-1">{address}</span>
                        </div>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Your Cart Items</h2>
                    <div className="space-y-4">
                        {
                            cartItems &&
                            cartItems.map((item) => (
                                <div className="flex flex-col sm:flex-row sm:items-start border-b pb-4 last:border-0" key={item.id}>
                                    <div className="flex items-start mb-3 sm:mb-0 sm:w-2/3">
                                        <div className="relative">
                                            <Link to={`/product/${item.id}`}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border border-gray-200"
                                                />
                                            </Link>
                                            {item.variation && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">
                                                    V
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 ml-3 md:ml-4">
                                            <Link to={`/product/${item.id}`} className="hover:text-yellow-600 transition-colors">
                                                <p className="text-sm md:text-base font-semibold truncate max-w-[180px] sm:max-w-[300px] lg:max-w-[400px]">
                                                    {item.name}
                                                </p>
                                            </Link>
                                            
                                            {/* Variation info */}
                                            {item.variation && (
                                                <div className="mt-1 inline-flex items-center bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    <span className="font-medium">Variation: {item.variation.name}</span>
                                                    {item.variation.color && (
                                                        <span className="ml-1 w-2 h-2 rounded-full inline-block align-middle" 
                                                            style={{ backgroundColor: item.variation.color }}></span>
                                                    )}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center mt-2">
                                                <span className="text-xs md:text-sm text-gray-600">
                                                    Quantity: <span className="font-medium">{item.quantity}</span>
                                                </span>
                                                <span className="mx-2 text-gray-300">|</span>
                                                <span className="text-xs md:text-sm text-gray-600">
                                                    Price: <span className="font-medium">Rs. {item.price.toFixed(0)}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="sm:w-1/3 sm:text-right flex flex-col items-end justify-center">
                                        <span className="text-sm md:text-base font-medium text-gray-900">
                                            Rs. {(item.price * item.quantity).toFixed(0)}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {item.quantity} × Rs. {item.price.toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="w-full md:w-1/3 px-3 md:px-6 border border-gray-200 p-4 md:p-6 rounded-lg bg-white shadow-sm h-fit sticky top-20">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Order Summary</h2>
                <div className="space-y-3 text-xs md:text-sm text-gray-700">
                    <div className="flex justify-between">
                        <p>Subtotal:</p>
                        <p>Rs. {subtotal.toFixed(0)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping:</p>
                        <p className={subtotal > 10000 ? "text-gray-700" : "text-green-600 font-medium"}>
                            {subtotal > 10000 ? `Rs. ${shippingCharges.toFixed(0)}` : "Free"}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p>GST (5%):</p>
                        <p>Rs. {tax.toFixed(0)}</p>
                    </div>
                </div>
                <hr className="my-3 md:my-4" />
                <div className="flex justify-between text-sm md:text-base font-semibold text-gray-900">
                    <p>Total:</p>
                    <p className="text-yellow-600">Rs. {totalPrice.toFixed(0)}</p>
                </div>
                <button 
                    onClick={proceedToPayment} 
                    className="w-full mt-4 md:mt-6 py-2 md:py-3 bg-yellow-500 text-white text-sm md:text-base rounded hover:bg-yellow-600 transition duration-300 flex items-center justify-center"
                >
                    <span>Proceed To Payment</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
