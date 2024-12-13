import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
// import { deleteProject, getAllProjects } from '../redux/actions/project'
import { deleteProduct, fetchProducts } from '../redux/reducers/products'
import { Skeleton } from '../components/Loader'
// import { loadUser } from '../redux/actions/user'

const AdminProjects = () => {


    const dispatch = useDispatch()
    const { loading, items: products, deleteError, deleteMessage } = useSelector(state => state.products)

    const deleteProductHandle = async (productId) => {

        await dispatch(deleteProduct(productId))

        toast.success('Product Deleted Successfully')
    }

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError)
        }
        if (deleteMessage) {
            toast.success(deleteMessage)
        }

        dispatch(fetchProducts())
    }, [deleteError, deleteMessage, dispatch])
    return (
        <div className='flex my-16'>
            <Sidebar />

            <section className="body-font flex-grow ">
                <div className=" px-1 py-10 mx-auto">
                    <button className="flex ml-8 text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 rounded">
                        <Link to={"/admin/addproduct"}>Add New Product</Link>
                    </button>
                    <div className="flex flex-col text-center w-full mb-8">
                        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2">Products</h1>

                    </div>

                    <div className="lg:px-2 w-full ">
                        <table className="table-auto w-full text-left whitespace-no-wrap">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg  rounded-tl rounded-bl">Name</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Price</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Category</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Edit</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Delete</th>

                                </tr>
                            </thead>
                            <tbody>


                                {
                                    loading ? <div className='flex h-full w-full justify-center mt-20 ml-72'><Skeleton /></div> : <>
                                        {
                                            products && products.map((product) => (

                                                <tr key={product?._id}>
                                                    <td className="px-4 py-3">{product?.name}</td>
                                                    <td className="px-4 py-3">{product?.price}</td>
                                                    <td className="px-4 py-3">{product?.category}</td>
                                                    <td className="px-4 py-3 text-lg ">
                                                        <Link to={`/admin/product/${product?._id}`} className='bg-black hover:bg-gray-700 text-white w-full py-1.5 rounded-md px-8'>
                                                            Edit
                                                        </Link>
                                                    </td>
                                                    <td className="px-2 py-3 text-lg text-gray-900">
                                                        <button className='bg-red-500 hover:bg-red-600 text-white w-full py-0.5 rounded-md' onClick={() => deleteProductHandle(product?._id)} >Delete</button>
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

export default AdminProjects