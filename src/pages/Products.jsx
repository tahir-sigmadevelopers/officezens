import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllCategories, fetchProducts } from '../redux/reducers/products';
import { useSearchProductsQuery } from '../redux/productsApi';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/Loader';
import { addToCart } from '../redux/actions/cartActions';




const Products = () => {

    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [maxPrice, setMaxPrice] = useState(1000000);
    const [page, setPage] = useState(1);



    const [subCategory, setSubCategory] = useState("");


    const dispatch = useDispatch();

    // Access products, loading, and error states from Redux store
    const { error, allCategories } = useSelector((state) => state.products);





    // Call search query with current parameters
    const { data: searchedData, isLoading: searchLoading, isError: productIsError } = useSearchProductsQuery({
        search: keyword,
        category,
        subCategory,
        sort,
        price: maxPrice,
        page
    });


    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error.message || 'Failed to fetch products');
        }
        if (productIsError) {
            toast.error('Failed to search products');
        }
    }, [error, productIsError]);

    // Fetch initial products if no keyword is entered
    useEffect(() => {
        if (!keyword) {
            dispatch(fetchProducts());
        }
    }, [dispatch, keyword]);

    // Update products based on the search results
    const displayedProducts = searchedData?.products;


    useEffect(() => {
        dispatch(fetchAllCategories());

    }, []);

    const addToCartHandler = (id, quantity) => {
        dispatch(addToCart(id, quantity));
        toast.success("Item Added to Cart");
    };



    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);
        setSubCategory("");
        setPage(1);
    };

    const handleSubCategoryChange = (selectedSubCategory) => {
        setSubCategory(selectedSubCategory);
        setCategory("");
        setPage(1);
    };




    return (
        <div className="bg-gray-50 py-10 px-4 md:px-16 mt-10">
            {/* Title and Category Tags */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Living Room Furniture</h1>
                <p className="text-gray-500">Home / List of Products</p>
                {/* <div className="mt-4 flex flex-wrap gap-3">
                    {['Study Table', 'Computer Table', 'Kids Table', 'Moveable Table', 'Dining table', 'More'].map(tag => (
                        <button key={tag} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full">
                            {tag}
                        </button>
                    ))}
                </div> */}
                <div className='relative'>
                    <input className='absolute bottom-4 right-8 p-2 rounded-lg border border-black ' type="text" placeholder='Search Here...' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                </div>
            </div>


            {searchLoading ? <Skeleton /> : <>

                {/* Filters and Product Grid */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <div className="w-full md:w-1/4 bg-white p-4 shadow-md rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Sort By</h2>
                        <div className="mb-4">
                            <h3 className="text-md font-medium text-gray-600 mb-2">Category</h3>
                            <ul className="space-y-2">
                                <li onClick={() => handleCategoryChange("")} className="ml-3 cursor-pointer hover:text-gray-900">
                                    All
                                </li>
                                {allCategories?.map((category) => (
                                    <div key={category?._id}>
                                        <label className="font-medium cursor-pointer" onClick={() => handleCategoryChange(category?.category)}>
                                            {category?.category}
                                        </label>
                                        {category?.subCategory?.length > 0 && (
                                            <select
                                                className="block w-full p-2 mt-2 border border-gray-300 rounded"
                                                value={subCategory}
                                                onChange={(e) => handleSubCategoryChange(e.target.value)}
                                            >
                                                <option value="">Select Subcategory</option>
                                                {category?.subCategory?.map((sub, index) => (
                                                    <option key={index} value={sub}>
                                                        {sub}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                            </ul>

                        </div>
                        <div className="mb-4 text-gray-500 hover:text-gray-700 mt-6">
                            <h3 className="text-md font-medium mb-2">Price</h3>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option className='outline-none' value="">None</option>
                                <option className='outline-none' value="price-desc">Price: High to Low</option>
                                <option className='outline-none' value="asc">Price: Low to High</option>
                            </select>
                        </div>

                    </div>

                    {/* Product Grid */}
                    <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProducts?.map((product) => (
                            <div key={product?._id} className="bg-white p-4 rounded-lg shadow-md">

                                <img
                                    src={product?.images.length > 0 && product?.images[0].url}
                                    alt={`${product.name} `}
                                    className="w-full h-40 object-cover rounded-md cursor-pointer"
                                    onClick={() => navigate(`/product/${product?._id}`)}
                                />
                                <h3 className="mt-2 font-semibold text-gray-800">{product?.name}</h3>
                                <p className="text-gray-600">${product?.price}</p>
                                <button className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md" onClick={() => addToCartHandler(product._id, 1)}>Add to Cart</button>
                            </div>
                        ))}
                    </div>
                </div>

            </>}

            {/* Pagination */}
            {/* <div className="flex justify-center items-center gap-2 mt-8">
                <button className="text-gray-500 hover:text-gray-700">&lt;</button>
                {[1, 2, 3, 4, 100].map((page) => (
                    <button key={page} className="px-3 py-1 rounded-full bg-yellow-200 hover:bg-yellow-300 text-yellow-700 font-medium">{page}</button>
                ))}
                <button className="text-gray-500 hover:text-gray-700">&gt;</button>
            </div> */}

            {/* Similar Items */}
            {/* <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {similarItems.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                            <img src={item?.image?.url} alt={item.name} className="w-full h-40 object-cover rounded-md" />
                            <h3 className="mt-2 font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-gray-600">{item.price}</p>
                            <button className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md">Add to</button>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default Products;







