import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getAllCategories } from "../redux/actions/category";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const Categories = () => {
  const dispatch = useDispatch();
  const { loading, categories, message } = useSelector((state) => state.category);

  const deletecategoryHandle = async (categoryId) => {
    await dispatch(deleteCategory(categoryId));
  };

  useEffect(() => {
    dispatch(getAllCategories());
    if (message) {
      dispatch({ type: "clearMessage" })
      toast.success(message)
    }
  }, [dispatch, message]);
  return (
    <div className="flex">
      <Sidebar />

      <section className=" body-font flex-grow ">
        <div className=" px-1 py-10 mx-auto">
          <button className="flex ml-8 text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 rounded">
            <Link to={"/dashboard/category/add"}>Add New Category</Link>
          </button>
          <div className="flex flex-col text-center w-full mb-8">
            <h1 className={`${categories?.length < 1 ? 'hidden' : "sm:text-4xl text-3xl font-medium title-font mb-2"} `}>
              Categories
            </h1>
          </div>

          <div className="lg:px-2 w-full overflow-auto">
            {
              categories?.length < 1 && <h2 className="text-2xl text-center mt-[12rem]">No Category Available</h2>
            }
            <table className={`${categories?.length < 1 ? 'hidden' : 'table-auto w-full text-left whitespace-no-wrap'}`}>
              <thead>
                <tr>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg  rounded-tl rounded-bl">
                    Category
                  </th>
                  {/* <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">
                    Created At
                  </th> */}
                  {/* <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">
                    Category
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">
                    Author
                  </th> */}
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">
                    Edit
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-sm md:text-lg ">
                    <p className="pl-10">Delete</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <div className="flex h-full w-full justify-center mt-20 overflow-hidden ml-[216px]">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {categories &&
                      categories.map((category) => (
                        <tr key={category._id}>
                          <td className="px-4 py-3">{category?.category}</td>
                          {/* <td className="px-4 py-3">
                            {category?.createdAt?.slice(0, 10)}
                          </td>
                          <td className="px-4 py-3">{category?.category}</td>
                          <td className="px-4 py-3 text-lg">
                            {category?.author}
                          </td> */}
                          <td className="px-4 py-3 text-lg">
                            <button className="bg-black hover:bg-gray-700 text-white w-2/4 py-0.5 rounded-md px-3">
                              <Link to={`/dashboard/category/edit/${category?._id}`}>
                                Edit
                              </Link>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-lg">
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white w-2/4 py-0.5 rounded-md"
                              onClick={() => deletecategoryHandle(category?._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section >
    </div >
  );
};

export default Categories;
