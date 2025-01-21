import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { createProduct, fetchAllCategories } from '../redux/reducers/products'
import { Skeleton } from '../components/Loader'
import imageCompression from 'browser-image-compression';

const AddProduct = () => {


    const [name, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [subCategory, setSubCategory] = useState("")
    const [price, setprice] = useState(0)
    const [stock, setStock] = useState(0)
    const [images, setImages] = useState([]);

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const { createError, message, createLoading, allCategories } = useSelector(state => state.products)




    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };




    const addProjectSubmit = async (e) => {
        e.preventDefault()


        const data = new FormData();
        data.set("name", name)
        data.set("description", description)
        data.set("category", category)
        data.set("subCategory", subCategory)
        data.set("price", price)
        data.set("stock", stock)

        images.forEach((image, index) => {
            data.append(`images`, image); // Add images as array
        });


        await dispatch(createProduct(data));
        toast.success(message)

        setTitle("")
        setDescription("")
        setCategory("")
        setprice(0)
        setStock(0)
        setImages([])

        navigate("/admin/products")
    }


    useEffect(() => {
        dispatch(fetchAllCategories());
    }, []);



    // Get the subcategories for the selected category
    const selectedCategory = allCategories.find(cat => cat?.category === category);

    const subCategories = selectedCategory ? selectedCategory?.subCategory : [];



    return (

        <div className='flex my-16'>
            <Sidebar />

            <div className="flex min-h-full container flex-col justify-center px-6 py-4 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-4 text-center text-2xl font-bold leading-4 tracking-tight">Add Product </h2>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={addProjectSubmit} className="space-y-1" encType="multipart/form-data">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium leading-6">Name</label>
                            <div className="mt-1">
                                <input value={name} type="text" name='name' onChange={(e) => setTitle(e.target.value)} autoComplete="title" required className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-grey-600 sm:text-sm sm:leading-6 px-2" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium leading-6">Description</label>
                            <div className="mt-2">
                                <textarea name="description" rows="4" class="w-full text-sm text-gray-900 bg-white   focus:ring-0  border p-1 border-black rounded-sm" placeholder="Write Product Description..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                            </div>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium leading-6">Category</label>
                            <select
                                value={category}
                                name="category"
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 focus:ring-2 sm:text-sm px-2"
                            >
                                <option value="">Select Category</option>
                                {allCategories?.map((cat) => (
                                    <option key={cat._id} value={cat.category}>
                                        {cat.category}
                                    </option>
                                ))}
                            </select>

                        </div>
                        {/* Sub Category   */}
                        {category && (
                            <div>
                                <label htmlFor="subCategory" className="block text-sm font-medium leading-6">Sub Category</label>
                                <select
                                    value={subCategory}
                                    name="subCategory"
                                    onChange={(e) => setSubCategory(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 focus:ring-2 sm:text-sm px-2"
                                >
                                    <option value="">Select Sub Category</option>
                                    {subCategories?.length > 0 && subCategories?.map((subCat, index) => (
                                        <option key={index} value={subCat}>
                                            {subCat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="price" className="block text-sm font-medium leading-6" autoComplete="price" >Price</label>
                            </div>

                            <div className="mt-1">
                                <input value={price} onChange={(e) => setprice(e.target.value)} type="number" name='price' autoComplete="price" required className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-text-gray-800sm:text-sm sm:leading-6 px-2" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="stock" className="block text-sm font-medium leading-6" autoComplete="stock" >Stock</label>
                            </div>

                            <div className="mt-1">
                                <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" name='stock' autoComplete="stock" required className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-text-gray-800sm:text-sm sm:leading-6 px-2" />
                            </div>
                        </div>








                        <div className='pb-2'>
                            <label htmlFor="images" className="block text-sm font-medium leading-6">images</label>
                            <div className="mt-1 pb-1">


                                <input
                                    name="images"
                                    accept="images/*"
                                    required
                                    multiple
                                    onChange={handleImageUpload}

                                    className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 shadow-lg p-4"
                                    type="file"

                                />
                                <div className="flex h-20 w-10 gap-4 mt-5  overflow-hidden">
                                    {images.map((image, index) => (
                                        <img key={index} src={image} alt={`Preview ${index + 1}`} className='w-10 h-10' />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            {
                                createLoading ? <Skeleton length={1} /> : <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offappend-2  mt-4">Create</button>
                            }
                        </div>
                    </form>


                </div>
            </div>
        </div>

    )
}

export default AddProduct