import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetails, updateOrder } from "../redux/actions/orderAction";
import { Skeleton } from "../components/Loader";
import toast from "react-hot-toast";

const OrderDetails = () => {


    const dispatch = useDispatch()
    const { loading, order } = useSelector(state => state.orders)


    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getOrderDetails(params.id))
    }, [dispatch])


    const handleProcessOrder = async () => {

        try {

            await dispatch(updateOrder(params.id))
            toast.success("Order updated successfully")
            navigate("/admin/orders")

        } catch (error) {
            toast.error(error?.message);
            console.log(error);

        }
    }

    return (
        <div className="flex flex-col gap-8 p-8 my-16">
            {loading ? <Skeleton length={6} /> : <>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Order Items Section */}
                    <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-center text-lg font-semibold mb-4">ORDER ITEMS</h2>
                        <div className="flex items-center justify-between border-b pb-4">
                            <img
                                src="https://via.placeholder.com/50"
                                alt="Product"
                                className="w-12 h-12 rounded-md"
                            />
                            <p className="font-semibold">{order?.orderItems[0]?.name}</p>
                            <p>{order?.orderItems[0]?.price} x {order?.orderItems[0]?.quantity} = {order?.itemsPrice}</p>
                        </div>
                    </div>

                    {/* Order Info Section */}
                    <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-center text-lg font-semibold mb-4">ORDER INFO</h2>

                        {/* User Info */}
                        <div className="mb-6">
                            <h3 className="font-bold mb-2">User Info</h3>
                            <p>
                                <span className="font-medium">Name:</span> {order?.user?.name}
                            </p>
                            <p>
                                <span className="font-medium">Address:</span> {order?.shippingInfo?.address}, {order?.shippingInfo?.city},
                                {order?.shippingInfo?.country},  {order?.shippingInfo?.pinCode}
                            </p>
                        </div>

                        {/* Amount Info */}
                        <div className="mb-6">
                            <h3 className="font-bold mb-2">Amount Info</h3>
                            <p>
                                <span className="font-medium">Subtotal:</span> {order?.itemsPrice}
                            </p>
                            <p>
                                <span className="font-medium">Tax:</span> {order?.tax}
                            </p>
                            {/* <p>
                                <span className="font-medium">Discount:</span> 0
                            </p> */}
                            <p className="font-semibold">
                                <span className="font-medium">Total:</span> {order?.total}
                            </p>
                        </div>

                        {/* Status Info */}
                        <div>
                            <h3 className="font-bold mb-2">Status Info</h3>
                            <p>
                                <span className="font-medium">Status:</span>{" "}
                                <span className="text-green-500 font-semibold">{order?.orderStatus}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Button Section */}
                <div className="flex justify-center mt-4">
                    <button onClick={handleProcessOrder} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                        Process Status
                    </button>
                </div>
            </>

            }
        </div>
    );
};

export default OrderDetails;
