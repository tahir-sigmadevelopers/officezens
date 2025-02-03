import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { deleteCategory, fetchAllCategories } from '../redux/reducers/products'
import { Skeleton } from '../components/Loader'
// import { loadUser } from '../redux/actions/user'

const AdminCategory = () => {


    const dispatch = useDispatch()
    const { loading, allCategories } = useSelector(state => state.products)


    const deleteCategoryHandle = async (categoryId) => {

        await dispatch(deleteCategory(categoryId))

        toast.success('Category Deleted Successfully')
    }

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, []);
    return (
        <div className='flex my-16'>
            <Sidebar />

            <section className="body-font flex-grow ">
                <div className=" px-1 py-10 mx-auto">
                    <button className="flex ml-8 text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 rounded">
                        <Link to={"/admin/addcategory"}>Add New Category</Link>
                    </button>
                    <div className="flex flex-col text-center w-full mb-8">
                        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2">Categories</h1>

                    </div>

                    <div className="lg:px-2 w-full  flex">
                        <table className="table-auto px-20 w-full text-left ml-40">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg rounded-tl rounded-bl">Main Categories</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Sub Categories</th>
                                </tr>
                            </thead>
                            <tbody>


                                {
                                    loading ? <div className='flex h-full w-full justify-center mt-20 ml-72'><Skeleton /></div> : <>
                                        {
                                            allCategories && allCategories?.map((product) => (

                                                <tr key={product?._id}>
                                                    <td className="px-4 py-3">{product?.category}</td>
                                                    <td className="px-4 py-3">{product?.subCategory} </td>
                                                    <td className="px-2 py-3 text-lg text-gray-900">
                                                        <button className='bg-red-500 hover:bg-red-600 text-white w-full py-0.5 rounded-md' onClick={() => deleteCategoryHandle(product?._id)} >Delete</button>
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

export default AdminCategory