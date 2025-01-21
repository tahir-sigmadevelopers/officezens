import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { fetchAllCategories, updateProduct } from '../redux/reducers/products'
import { Skeleton } from '../components/Loader'
import { fetchProductDetails } from '../redux/reducers/product-details'

const UpdateProduct = () => {

    const { updateError, message, updateLoading, allCategories } = useSelector(state => state.products);
    const { product, loading: productLoading } = useSelector((state) => state.productDetails);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("")
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const imagesUploadChange = (e) => {
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

    const updateProjectSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.set("name", name);
        data.set("description", description);
        data.set("category", category);
        data.set("subCategory", subCategory);
        data.set("price", price);
        data.set("stock", stock);

        images.forEach((image, index) => {
            data.append(`images`, image); // Add images as array
        });


        const resultAction = await dispatch(updateProduct({ id: params.id, data }));

        if (updateProduct.fulfilled.match(resultAction)) {
            toast.success("Product updated successfully!");
            navigate("/admin/products");
        } else if (updateProduct.rejected.match(resultAction)) {
            const error = resultAction.payload || "Failed to update product!";
            toast.error(error);
            console.log("Error during product update:", error);
            console.log("Full action details:", resultAction);
        }
    };


    useEffect(() => {
        if (updateError) {
            toast.error(updateError);
        }
    }, [updateError]);

    useEffect(() => {
        dispatch(fetchProductDetails(params.id));
    }, [dispatch, params.id]);

    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setCategory(product.category || "");
            setCategory(product.subCategory || "");
            setPrice(product.price || 0);
            setStock(product.stock || 0);
            setImages(product.images || []);
        }
    }, [product]);



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
                    <h2 className="mt-4 text-center text-2xl font-bold leading-4 tracking-tight">Update Product</h2>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={updateProjectSubmit} className="space-y-1" encType="multipart/form-data">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6">Name</label>
                            <div className="mt-1">
                                <input value={name} type="text" name='name' onChange={(e) => setName(e.target.value)} autoComplete="name" className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-grey-600 sm:text-sm sm:leading-6 px-2" />
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

                        <div>
                            <label htmlFor="subCategory" className="block text-sm font-medium leading-6">Sub Category</label>
                            <select
                                value={subCategory}
                                name="subCategory"
                                onChange={(e) => setSubCategory(e.target.value)}

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





                        <div>
                            <label htmlFor="price" className="block text-sm font-medium leading-6">Price</label>
                            <div className="mt-1">
                                <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="number" name='price' autoComplete="price" className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-text-gray-800 sm:text-sm sm:leading-6 px-2" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium leading-6">Stock</label>
                            <div className="mt-1">
                                <input value={stock} onChange={(e) => setStock(Number(e.target.value))} type="number" name='stock' autoComplete="stock" className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inappend ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inappend focus:ring-text-gray-800 sm:text-sm sm:leading-6 px-2" />
                            </div>
                        </div>

                        <div className='pb-2'>
                            <label htmlFor="images" className="block text-sm font-medium leading-6">Images</label>
                            <div className="mt-1 pb-1">
                                <input
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={imagesUploadChange}
                                    className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 shadow-lg p-4"
                                    type="file"
                                />
                            </div>
                        </div>

                        <div>
                            {
                                updateLoading ? <Skeleton length={1} /> : <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mt-4">Update</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
