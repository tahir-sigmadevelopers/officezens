import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserProfile, getAllUsers } from '../redux/actions/admin'
import { toast } from 'react-hot-toast'
import Loader from '../components/Loader'
import { loadUser } from '../redux/actions/user'

const Users = () => {

    const dispatch = useDispatch()
    const { loading, error, users, message } = useSelector(state => state.admin)


    const deleteUser = (userId) => {
        dispatch(deleteUserProfile(userId))
    }

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch({ type: "clearError" })
        }
        if (message) {
            toast.success(message)
            dispatch({ type: "clearMessage" })
        }
        dispatch(loadUser())

        dispatch(getAllUsers())
    }, [error, message])
    return (
        <div className='flex'>
            <Sidebar />

            <section className=" body-font container">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-8">
                        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2">Sigma Developers Users</h1>

                    </div>
                    <div className=" w-full mx-auto overflow-auto">
                        <table className="table-auto w-full text-left whitespace-no-wrap">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Joined At</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg  rounded-tl rounded-bl">Name</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Email</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Role</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Edit</th>
                                    <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">Delete</th>


                                </tr>
                            </thead>


                            <tbody>

                                {
                                    loading ? <div className='flex h-[50vh] w-full justify-center items-center ml-40'><Loader /></div> : <>

                                        {
                                            users && users.map((user) => (
                                                <tr key={user._id}>
                                                    <td className="px-4 py-3">{user.joinedAt.slice(0, 10)}</td>
                                                    <td className="px-4 py-3">{user.name}</td>
                                                    <td className="px-4 py-3">{user.email}</td>
                                                    <td className="px-4 py-3 text-lg">{user.role}</td>
                                                    <td className="px-4 py-3 text-lg">
                                                        <button className='bg-black hover:bg-gray-700 text-white w-full py-0.5 rounded-md px-3'>
                                                            <Link to={`/dashboard/user/${user._id}`}>Edit</Link>
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 text-lg">
                                                        <button className='bg-red-500 hover:bg-red-600 text-white w-full py-0.5 rounded-md' onClick={() => deleteUser(user._id)}>Delete</button>
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

export default Users