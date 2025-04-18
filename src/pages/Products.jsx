import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchProductsQuery, useGetCategoriesQuery } from '../redux/productsApi';
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
    const [showFilters, setShowFilters] = useState(false);
    const [subCategory, setSubCategory] = useState("");

    const dispatch = useDispatch();

    // Use RTK Query hooks with automatic caching
    const { data: searchedData, isLoading: searchLoading, isError: productIsError } = useSearchProductsQuery({
        search: keyword,
        category,
        subCategory,
        sort,
        price: maxPrice,
        page
    }, {
        refetchOnMountOrArgChange: false, // Don't refetch when component remounts if data exists
        skip: false // Don't skip the query
    });

    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery(undefined, {
        refetchOnMountOrArgChange: false // Don't refetch when component remounts
    });

    // Get categories from RTK Query
    const allCategories = categoriesData || [];

    // Handle errors
    useEffect(() => {
        if (productIsError) {
            toast.error('Failed to search products');
        }
    }, [productIsError]);

    // Update products based on the search results
    const displayedProducts = searchedData?.products;

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

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="bg-gray-50 py-6 md:py-10 px-4 md:px-16 mt-10">
            {/* Title and Category Tags */}
            <div className="mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Living Room Furniture</h1>
                <p className="text-gray-500 text-sm md:text-base">Home / List of Products</p>
                
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4'>
                    <button 
                        onClick={toggleFilters}
                        className="mb-3 sm:mb-0 px-4 py-2 bg-yellow-500 text-white rounded-lg md:hidden"
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <div className='w-full sm:w-auto'>
                        <input 
                            className='w-full sm:w-auto p-2 rounded-lg border border-black' 
                            type="text" 
                            placeholder='Search Here...' 
                            value={keyword} 
                            onChange={(e) => setKeyword(e.target.value)} 
                        />
                    </div>
                </div>
            </div>

            {searchLoading || categoriesLoading ? <Skeleton /> : <>
                {/* Filters and Product Grid */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Filters - Mobile */}
                    <div className={`${showFilters ? 'block' : 'hidden'} md:hidden w-full bg-white p-4 shadow-md rounded-lg mb-4`}>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Sort By</h2>
                        <div className="mb-4">
                            <h3 className="text-md font-medium text-gray-600 mb-2">Category</h3>
                            <ul className="space-y-2">
                                <li onClick={() => {
                                    handleCategoryChange("");
                                    setShowFilters(false);
                                }} className="ml-3 cursor-pointer hover:text-gray-900">
                                    All
                                </li>
                                {allCategories?.map((category) => (
                                    <div key={category?._id}>
                                        <label className="font-medium cursor-pointer" onClick={() => {
                                            handleCategoryChange(category?.category);
                                            setShowFilters(false);
                                        }}>
                                            {category?.category}
                                        </label>
                                        {category?.subCategory?.length > 0 && (
                                            <select
                                                className="block w-full p-2 mt-2 border border-gray-300 rounded"
                                                value={subCategory}
                                                onChange={(e) => {
                                                    handleSubCategoryChange(e.target.value);
                                                    setShowFilters(false);
                                                }}
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
                            <select 
                                value={sort} 
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setShowFilters(false);
                                }}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option className='outline-none' value="">None</option>
                                <option className='outline-none' value="price-desc">Price: High to Low</option>
                                <option className='outline-none' value="asc">Price: Low to High</option>
                            </select>
                        </div>
                    </div>

                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden md:block w-full md:w-1/4 bg-white p-4 shadow-md rounded-lg">
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
                    <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {displayedProducts?.map((product) => (
                            <div key={product?._id} className="bg-white p-3 md:p-4 rounded-lg shadow-md">
                                <img
                                    src={product?.images.length > 0 && product?.images[0].url}
                                    alt={`${product.name} `}
                                    className="w-full h-32 sm:h-40 object-cover rounded-md cursor-pointer"
                                    onClick={() => navigate(`/product/${product?._id}`)}
                                    loading="lazy" // Add lazy loading for images
                                />
                                <h3 className="mt-2 text-sm md:text-base font-semibold text-gray-800 truncate">{product?.name}</h3>
                                <p className="text-sm md:text-base text-gray-600">Rs. {product?.price}</p>
                                <button className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-1 md:py-2 rounded-md text-sm md:text-base" onClick={() => addToCartHandler(product._id, 1)}>Add to Cart</button>
                            </div>
                        ))}
                    </div>
                </div>
            </>}
        </div>
    );
};

export default Products;







