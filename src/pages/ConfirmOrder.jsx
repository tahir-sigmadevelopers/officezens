import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const OrderSummary = () => {

    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);

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
        <div className="flex flex-col md:flex-row md:space-x-4 p-10 md:py-24">
            {/* Left Side: Shipping Info and Cart Items */}
            <div className="md:w-2/3 px-6 space-y-8 md:py-20 ">
                {/* Shipping Info */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Shipping Info</h2>
                    <div className="text-gray-700">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Phone:</strong> {shippingInfo.phoneNo}</p>
                        <p><strong>Address:</strong> {address}</p>
                    </div>
                </div>

                {/* Cart Items */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Your Cart Items:</h2>
                    <div className="space-y-4">
                        {
                            cartItems &&
                            cartItems.map((item) => <div className="flex items-center" key={item.id}>
                                <img
                                    src={item.image} // Replace with actual image URL
                                    alt="Canon EOS Rebel T8i"
                                    className="w-16 h-16 rounded mr-4"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold"><Link to={`/product/${item.id}`}>{item.name}</Link>{" "}</p>
                                </div>
                                <span className="text-gray-600 px-1 "> {item.quantity} X Rs.{item.price}  = {" "}
                                    <b className="text-sm text-gray-900">Rs. {item.price * item.quantity}</b>
                                </span>
                            </div>



                            )


                        }
                    </div>
                </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="md:w-1/3 px-6 border border-gray-200 p-6 rounded-lg md:py-20">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                        <p>Subtotal:</p>
                        <p>{subtotal}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping Charges:</p>
                        <p>{shippingCharges}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>GST:</p>
                        <p>{tax}</p>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-xl font-semibold text-gray-900">
                    <p>Total:</p>
                    <p>{totalPrice}</p>
                </div>
                <button onClick={proceedToPayment} className="w-full mt-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Proceed To Payment
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
