import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { editCategory, getCategory } from "../redux/actions/category";

const EditCategory = () => {

    const { loading, message, error, category: categoryToBeEdit } = useSelector((state) => state.category);

    const [category, setCategory] = useState(categoryToBeEdit?.category);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const params = useParams()
    const id = params.id

    const updateCategorySubmit = async (e) => {
        e.preventDefault();

        console.log(category);
        await dispatch(editCategory(category, id));

        navigate("/dashboard/categories");
    };

    useEffect(() => {
        getCategory(id)
        setCategory(categoryToBeEdit)
        if (message) {
            toast.success(message);
            dispatch({ type: "clearMessage" });
        }
        if (error) {
            toast.error(error);
            dispatch({ type: "clearError" });
        }
    }, [message, error])

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex min-h-full container flex-col justify-center px-6 py-8 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                
                    <h2 className="mt-4 text-center text-2xl font-bold leading-4 tracking-tight">
                        Update Category
                    </h2>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        onSubmit={updateCategorySubmit}
                        className="space-y-1"
                        encType="multipart/form-data"
                    >
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium leading-6"
                            >
                                Category
                            </label>
                            <div className="mt-1">
                                <input
                                    value={category}
                                    type="text"
                                    name="category"
                                    onChange={(e) => setCategory(e.target.value)}
                                    autoComplete="category"
                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-grey-600 sm:text-sm sm:leading-6 px-2"
                                />
                            </div>
                        </div>

                        <div>
                            {loading ? (
                                <div className="mt-10"> <Loader /></div>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offappend-2 focus-visible:outline-gray-900 mt-4"
                                >
                                    Update
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;
