import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { editBlog, getBlogDetails } from "../redux/actions/blog";
import { useRef } from "react";
import JoditEditor from "jodit-react";
import { getAllCategories } from "../redux/actions/category";

const EditBlog = () => {

  const { blog } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.category);

  const editor = useRef(null);
  const [title, setTitle] = useState(blog?.title);
  const [shortDescription, setShortDescription] = useState(blog?.shortDescription);
  const [content, setContent] = useState(blog?.content);
  const [category, setCategory] = useState(blog?.category?.category);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const params = useParams();


  const updateProjectSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("shortDescription", shortDescription);
    data.set("content", content);
    data.set("category", category);

    await dispatch(editBlog(data, params.id));

    setTitle("");
    setContent("");
    setCategory("");
    navigate("/dashboard/blogs");
  };

  useEffect(() => {
    dispatch(getBlogDetails(params.id));
    dispatch(getAllCategories())
    // if (blog) {
    //   setTitle(blog?.title);
    //   setShortDescription(blog?.shortDescription);
    //   setContent(blog?.content);
    //   setCategory(blog?.category?.category);
    // }
    // if (message) {
    //   toast.success(message);
    //   dispatch({ type: "clearMessage" });
    // }
    // if (error) {
    //   toast.error(error);
    //   dispatch({ type: "clearError" });
    // }
  }, [dispatch]);
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex min-h-full container flex-col justify-center px-6 py-8 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
         
          <h2 className="mt-4 text-center text-2xl font-bold leading-4 tracking-tight">
            Update Blog{" "}
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={updateProjectSubmit}
            className="space-y-1"
            encType="multipart/form-data"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6"
              >
                Title
              </label>
              <div className="mt-1">
                <input
                  value={title}
                  type="text"
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete="title"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-grey-600 sm:text-sm sm:leading-6 px-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium leading-6"
              >
                Short Description
              </label>
              <div className="mt-1">
                <input
                  value={shortDescription}
                  type="text"
                  name="shortDescription"
                  onChange={(e) => setShortDescription(e.target.value)}
                  autoComplete="shortDescription"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-grey-600 sm:text-sm sm:leading-6 px-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium leading-6"
              >
                Content
              </label>
              <div className="mt-1">
                <JoditEditor
                  ref={editor}
                  value={content}
                  // config={config}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                  onChange={(newContent) => { }}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium leading-6"
              >
                Category
              </label>
              <div className="mt-1">
                <select
                  name="category"
                  id="category"
                  className="w-full outline outline-offset-2 outline-1 outline-slate-300 p-2 my-2 rounded-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat, index) => (
                    <option key={index} value={cat.category} >
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="author"
                  className="block text-sm font-medium leading-6"
                  autoComplete="author"
                >
                  Author
                </label>
              </div>
              <div className="mt-1">
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  type="text"
                  name="author"
                  autoComplete="author"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-text-gray-800sm:text-sm sm:leading-6 px-2"
                />
              </div>
            </div> */}

            {/* <div className="pb-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6"
              >
                Image
              </label>
              <div className="mt-1 pb-1">
                <input
                  name="image"
                  accept="image/*"
                  onChange={imageUploadChange}
                  className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 shadow-lg p-4"
                  type="file"
                />
              </div>
            </div> */}

            <div>
              {/* {loading ? (
                <Loader />
              ) : ( */}
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offappend-2 focus-visible:outline-gray-900 mt-4"
              >
                Update
              </button>
              {/* )} */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
