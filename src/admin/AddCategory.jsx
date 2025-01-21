import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { addCategory } from "../redux/reducers/products";

const AddCategory = () => {
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([""]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, message, error } = useSelector((state) => state.products);

  const handleSubCategoryChange = (index, value) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index] = value;
    setSubCategories(updatedSubCategories);
  };

  const addCategorySubmit = async (e) => {
    e.preventDefault();
    await dispatch(addCategory({ category, subCategory: subCategories }));
    toast.success(message);
    navigate("/admin/products");
  };

  const addSubCategoryField = () => {
    setSubCategories([...subCategories, ""]);
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex min-h-full container flex-col justify-center px-6 py-8 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-4 text-center text-2xl font-bold leading-4 tracking-tight">
            Add Category
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={addCategorySubmit} className="space-y-1">
            <div>
              <label htmlFor="category" className="block text-sm font-medium leading-6">
                Category
              </label>
              <div className="mt-1">
                <input
                  value={category}
                  type="text"
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Main Category"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-grey-600 sm:text-sm sm:leading-6 px-2"
                />
              </div>

              {subCategories.map((subCategory, index) => (
                <div key={index} className="mt-5">
                  <label
                    htmlFor={`subcategory-${index}`}
                    className="block text-sm font-medium leading-6"
                  >
                    Sub Category {index + 1}
                  </label>
                  <input
                    value={subCategory}
                    type="text"
                    name={`subcategory-${index}`}
                    onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                    placeholder="Sub Category"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-grey-600 sm:text-sm sm:leading-6 px-2"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addSubCategoryField}
                className="mt-3 text-sm text-gray-600 underline"
              >
                Add More Subcategories
              </button>
            </div>

            <div>
              {loading ? (
                <div className="mt-10">
                  <Skeleton length={2} />
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 mt-4"
                >
                  Create
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
