import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, getAllBlogs } from "../redux/actions/blog";
import Loader from "../components/Loader";

const AdminProjects = () => {
  const dispatch = useDispatch();
  const { loading, blogs } = useSelector((state) => state.blog);

  const deleteProjectHandle = async (projectId) => {
    await dispatch(deleteBlog(projectId));
  };

  useEffect(() => {
    dispatch(getAllBlogs());
  }, []);
  return (
    <div className="flex ">
      <Sidebar />

      <section className=" body-font flex-grow ">
        <div className=" px-1 py-10 mx-auto">
          <button className="flex ml-8 text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 rounded">
            <Link to={"/dashboard/blog/create"}>Add New Blog</Link>
          </button>
          <div className="flex flex-col text-center w-full mb-8">
            <h1 className={`${blogs?.length < 1 ? 'hidden' : '' } sm:text-4xl text-3xl font-medium title-font mb-2 `}>
              Blogs
            </h1>
          </div>

          <div className="lg:px-2 w-full overflow-auto">
            <table className="table-auto w-full text-left whitespace-no-wrap overflow-x-hidden">
              {
                // !blogs === "undefined" ? "" :
                <thead className={`${blogs?.length < 1 ? 'hidden' : ''}`}>
                  <tr>
                    <th className="px-4 py-3 title-font tracking-wider font-medium  text-sm md:text-lg  rounded-tl rounded-bl">
                      Title
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium  text-sm md:text-lg ">
                      Created At
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium  text-sm md:text-lg ">
                      Category
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium  text-sm md:text-lg ">
                      Author
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium  text-sm md:text-lg ">
                      Edit
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium  text-sm md:text-lg ">
                      Delete
                    </th>
                  </tr>
                </thead>
              }
              <tbody>
                {loading ? (
                  <div className="flex h-full w-full justify-center mt-20 ml-72 overflow-hidden">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {
                      blogs?.length > 0 ? blogs?.map((blog) => (
                        <tr key={blog._id}>
                          <td className="px-4 py-3">{blog?.title}</td>
                          <td className="px-4 py-3">
                            {blog?.createdAt?.slice(0, 10)}
                          </td>
                          <td className="px-4 py-3">{blog?.category?.category}</td>
                          <td className="px-4 py-3 text-lg ">
                            {blog?.author}
                          </td>
                          <td className="px-4 py-3 text-lg ">
                            <button className="bg-black hover:bg-gray-700 text-white w-full py-0.5 rounded-md px-3">
                              <Link to={`/dashboard/blog/edit/${blog?._id}`}>
                                Edit
                              </Link>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-lg ">
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white w-full py-0.5 rounded-md"
                              onClick={() => deleteProjectHandle(blog?._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )) : <div className="text-center mt-[12rem]">
                        <h1 className="text-2xl mr-[4rem] font-semibold">
                          No Blog Post
                        </h1>
                      </div>
                    }
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProjects;
