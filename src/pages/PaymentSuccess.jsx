import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const PaymentSuccess = () => {
    const location = useLocation();
    const [paymentMethod, setPaymentMethod] = useState("stripe");

    useEffect(() => {
        // Check if the URL contains a query parameter indicating payment method
        const queryParams = new URLSearchParams(location.search);
        const method = queryParams.get("method");
        if (method) {
            setPaymentMethod(method);
        }
    }, [location]);

    return (
        <>
            <div className="bg-gray-50 h-[85vh]">
                <div className="md:py-12 p-6 md:mx-auto">
                    <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                        <path fill="currentColor"
                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                        </path>
                    </svg>
                    <div className="text-center">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                            {paymentMethod === "cod" ? "Order Placed Successfully!" : "Payment Done!"}
                        </h3>
                        <p className="text-gray-600 my-2">
                            {paymentMethod === "cod" 
                                ? "Thank you for your order. You'll pay when your order is delivered."
                                : "Thank you for completing your secure online payment."}
                        </p>
                        <h4 className='text-gray-900 font-medium mt-4'>
                            {paymentMethod === "cod"
                                ? "We'll process your order immediately."
                                : "Have a great day!"}
                        </h4>
                        <div className="py-10 text-center">
                            <Link to={"/products"} className="px-12 bg-yellow-500 rounded-lg hover:bg-yellow-400 text-white font-semibold py-3">
                                CONTINUE SHOPPING
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentSuccess