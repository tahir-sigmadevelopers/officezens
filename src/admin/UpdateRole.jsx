import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import Loader from '../components/Loader'
import { updateRole } from '../redux/actions/admin'
import { useNavigate, useParams } from 'react-router-dom'

const UpdateRole = () => {


    const [role, setRole] = useState("")

    const dispatch = useDispatch()

    const { loading, message, error } = useSelector(state => state.admin)

    const navigate = useNavigate()
    const params = useParams()
    const updateRoleSubmit = async(e) => {
        e.preventDefault()

        await dispatch(updateRole(params.id, role));
        navigate("/dashboard/users")
    }

    useEffect(() => {
        if (message) {
            toast.success(message)
            dispatch({ type: "clearMessage" })
        }
        if (error) {
            toast.error(error)
            dispatch({ type: "clearError" })
        }

    }, [message, error, dispatch])

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">Update User Role</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={updateRoleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6">Role</label>
                        <div className="mt-2">
                            <input value={role} onChange={(e) => setRole(e.target.value)} type="text" autoComplete="role" required className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:text-sm sm:leading-6 px-2" />
                        </div>
                    </div>


                    <div>
                        {
                            loading ? <Loader /> : <button type="submit" className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">Submit</button>
                        }
                    </div>
                </form>


            </div>
        </div>
    )
}

export default UpdateRole