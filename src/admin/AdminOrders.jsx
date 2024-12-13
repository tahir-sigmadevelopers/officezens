import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
// import { deleteProject, getAllProjects } from '../redux/actions/project'
import { deleteProduct, fetchProducts } from '../redux/reducers/products'
import { Skeleton } from '../components/Loader'
import { getAdminOrders } from '../redux/actions/orderAction'

const AdminOrders = () => {


    const dispatch = useDispatch()
    const { loading, orders, deleteError, deleteMessage } = useSelector(state => state.orders)

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError)
        }
        if (deleteMessage) {
            toast.success(deleteMessage)
        }

        dispatch(getAdminOrders())
    }, [deleteError, deleteMessage, dispatch])


    return (
        <div className='flex my-16'>
            <Sidebar />

            <section className="body-font flex-grow">
                <div className=" px-1 py-10 mx-auto">

                    <div className="flex flex-col text-center w-full mb-8">
                        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2">Orders List</h1>

                    </div>

                    <div className="lg:px-2 w-full">
                        <table className="table-auto w-full text-left whitespace-no-wrap">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg  rounded-tl rounded-bl">Username</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Amount</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Quantity</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Status</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Action</th>
                                    {/* <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Action</th> */}
                                </tr>
                            </thead>
                            <tbody>


                                {
                                    loading ? <div className='flex h-full w-full justify-center mt-20 ml-72'><Skeleton /></div> : <>
                                        {
                                            orders && orders.map((order) => (

                                                <tr key={order?._id}>
                                                    <td className="px-4 py-3">{order?.user?.name}</td>
                                                    <td className="px-4 py-3">{order?.total}</td>
                                                    <td className="px-4 py-3">{order?.orderItems[0].quantity}</td>
                                                    <td className="px-4 py-3 text-lg ">
                                                        {order?.orderStatus}
                                                    </td>
                                                    <td className="px-2 py-3 text-lg text-gray-900">
                                                        <Link to={`/admin/order/manage/${order?._id}`} className='bg-blue-500 hover:bg-blue-600 text-white w-full py-1 px-2  rounded-md' >Manage</Link>
                                                    </td>

                                                </tr>
                                            ))
                                        }

                                    </>
                                }



                            </tbody>
                        </table>
                    </div>

                </div>
            </section>

        </div>
    )
}

export default AdminOrders