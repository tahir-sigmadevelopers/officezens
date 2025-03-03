import React, { useState } from "react";
import { server } from "../redux/constants";
import toast from "react-hot-toast";

const JazzCashPayment = () => {
    const [amount, setAmount] = useState("");

    const handlePayment = async (e) => {
        e.preventDefault();
        const response = await fetch(`${server}/api/jazzcash-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: amount,
                orderId: "Order123", // Ensure this is passed
            }),
        });

        const result = await response.json();
        console.log(result);

        if (result.pp_ResponseCode === "000") {
            toast.success("Payment Successful");
        } else {
            toast.error(`Payment Failed: ${result.pp_ResponseMessage}`);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-lg font-bold mb-3">JazzCash Payment</h2>
            <form onSubmit={handlePayment}>
                <input
                    type="number"
                    placeholder="Enter Amount (PKR)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="border p-2 w-full mb-3"
                />
                <button
                    type="submit"
                    className="bg-purple-600 text-white px-5 py-2 rounded"
                >
                    Pay with JazzCash
                </button>
            </form>
        </div>
    );
};

export default JazzCashPayment;
