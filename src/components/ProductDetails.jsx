import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../redux/reducers/product-details';
import toast from 'react-hot-toast';
import { Skeleton } from './Loader';
import { addToCart } from '../redux/actions/cartActions';


const ProductDetails = () => {

    const [quantity, setQuantity] = useState(1);

    const { id } = useParams()

    const dispatch = useDispatch();

    // Access product details, loading, and error states from Redux store
    const { product, loading, error } = useSelector((state) => state.productDetails);

    // Access cart items from Redux store
    const { cartItems } = useSelector((state) => state.cart);



    // if (!product) return <Navigate to={"/products"} />
    useEffect(() => {
        dispatch(fetchProductDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);



    const increaseQuantity = () => {
        if (quantity >= product.stock) return;
        let qty = quantity + 1;
        setQuantity(qty);
    };

    const decreaseQuantity = () => {
        if (quantity <= 1) return;
        let qty = quantity - 1;

        setQuantity(qty);
    };


    const addToCartHandler = () => {
        dispatch(addToCart(id, quantity));
        toast.success("Item Added to Cart");
    };




    return (
        <div className="container mx-auto py-10 px-12 ">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
                Home / List of Products / {product && product?.name}

            </div>

            {
                loading ? <Skeleton /> :
                    <>
                        <div className="flex flex-wrap">
                            {/* Left Section - Product Images */}
                            <div className="w-full lg:w-1/2 flex flex-col">
                                <div className="mb-4">
                                    <img
                                        src={product?.images[0].url}
                                        alt="Main Product"
                                        className="rounded-lg w-[80%]"
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <img
                                        src="https://www.jiomart.com/images/product/original/rvcdgazzao/tekavo-office-table-computer-desk-pc-laptop-study-writing-table-for-home-office-100-l-x60-product-images-orvcdgazzao-p600060325-1-202304011032.jpg?im=Resize=(420,420)"
                                        alt="Thumbnail 1"
                                        className="w-20 h-20 rounded-lg cursor-pointer"
                                    />
                                    <img
                                        src="https://www.jiomart.com/images/product/original/rvcdgazzao/tekavo-office-table-computer-desk-pc-laptop-study-writing-table-for-home-office-100-l-x60-product-images-orvcdgazzao-p600060325-1-202304011032.jpg?im=Resize=(420,420)"
                                        alt="Thumbnail 2"
                                        className="w-20 h-20 rounded-lg cursor-pointer"
                                    />
                                    <img
                                        src="https://www.jiomart.com/images/product/original/rvcdgazzao/tekavo-office-table-computer-desk-pc-laptop-study-writing-table-for-home-office-100-l-x60-product-images-orvcdgazzao-p600060325-1-202304011032.jpg?im=Resize=(420,420)"
                                        alt="Thumbnail 3"
                                        className="w-20 h-20 rounded-lg cursor-pointer"
                                    />
                                    <img
                                        src="https://www.jiomart.com/images/product/original/rvcdgazzao/tekavo-office-table-computer-desk-pc-laptop-study-writing-table-for-home-office-100-l-x60-product-images-orvcdgazzao-p600060325-1-202304011032.jpg?im=Resize=(420,420)"
                                        alt="Thumbnail 4"
                                        className="w-20 h-20 rounded-lg  cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Right Section - Product Information */}
                            <div className="w-full lg:w-1/2 lg:pl-10 mt-10 lg:mt-0">
                                <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                                    {product?.name}
                                </h1>
                                <p className="text-gray-600 mb-4">
                                    {product?.description}
                                </p>
                                <div className="flex items-center space-x-2 text-gray-800 mb-4">
                                    <span className="text-2xl font-semibold"> Rs.{product?.price}</span>
                                    <span className="text-gray-400 line-through">${Math.ceil(product?.price * 1.3)}</span>
                                </div>

                                {/* Rating and Stock */}
                                <div className="flex items-center mb-4">
                                    <span className="text-yellow-500">★★★★☆</span>
                                    <span className="text-gray-600 ml-2">(50 Reviews)</span>
                                    {product?.stock > 0 ? <span className="ml-4 text-green-500">In Stock</span> : <span className="ml-4 text-red-500">Out of Stock</span>}

                                </div>

                                {/* Features */}
                                {/* <div className="flex space-x-4 mb-6">
                        <div className="flex flex-col items-center">
                            <img src="https://via.placeholder.com/50" alt="Free Delivery" />
                            <span className="text-gray-600 text-xs">Free Delivery</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src="https://via.placeholder.com/50" alt="Secure Transaction" />
                            <span className="text-gray-600 text-xs">Secure Transaction</span>
                        </div>
                    </div> */}

                                {/* Quantity and Buttons */}
                                <div className="flex items-center mb-6">
                                    <button onClick={decreaseQuantity} className="px-4 py-2 bg-gray-200">-</button>

                                    <input
                                        type="number"
                                        value={quantity}
                                        className="w-12 text-center border border-gray-300 p-2 rounded-lg m-1"
                                        readOnly
                                    />
                                    <button
                                        onClick={increaseQuantity}
                                        disabled={cartItems.length <= 0}
                                        className="px-4 py-2 bg-gray-200">+</button>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        disabled={product?.stock < 1 ? true : false}
                                        onClick={addToCartHandler}
                                        className="bg-black hover:bg-gray-900 text-white py-2 px-6 rounded-lg" >
                                        Add To Cart
                                    </button>
                                    <Link to={"/cart"} className="bg-gray-300 hover:bg-gray-200 text-black py-2 px-6 rounded-lg">
                                        Buy Now
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </>
            }
            {/* Tabs Section */}
            {/* <div className="flex space-x-4 mt-10">
                <button className="px-4 py-2 bg-gray-200 rounded-lg">Product Info</button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg">Product Description</button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg">Feedback</button>
            </div> */}

            {/* Frequently Bought Together */}
            {/* <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Frequently Bought Together</h2>
                <div className="flex space-x-4">
                    <div className="w-1/4 bg-white rounded-lg shadow-lg p-4">
                        <img
                            src="https://www.jiomart.com/images/product/original/rvcdgazzao/tekavo-office-table-computer-desk-pc-laptop-study-writing-table-for-home-office-100-l-x60-product-images-orvcdgazzao-p600060325-1-202304011032.jpg?im=Resize=(420,420)"
                            alt="Product 1"
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-gray-700">Comfortable Soft Chair</h3>
                        <p className="text-gray-800">$40.00</p>
                        <button className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg mt-4">
                            Add to Cart
                        </button>
                    </div>
                    <div className="w-1/4 bg-white rounded-lg shadow-lg p-4">
                        <img
                            src="https://www.jiomart.com/images/product/original/rvcdgazzao/tekavo-office-table-computer-desk-pc-laptop-study-writing-table-for-home-office-100-l-x60-product-images-orvcdgazzao-p600060325-1-202304011032.jpg?im=Resize=(420,420)"
                            alt="Product 2"
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-gray-700">New Soft Chair</h3>
                        <p className="text-gray-800">$20.00</p>
                        <button className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg mt-4">
                            Add to Cart
                        </button>
                    </div>
                    <div className="w-1/4 bg-white rounded-lg shadow-lg p-4">
                        <img
                            src="https://www.jiomart.com/images/product/original/rvcdgazzao/tekavo-office-table-computer-desk-pc-laptop-study-writing-table-for-home-office-100-l-x60-product-images-orvcdgazzao-p600060325-1-202304011032.jpg?im=Resize=(420,420)"
                            alt="Product 3"
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-gray-700">Modern Soft Chair</h3>
                        <p className="text-gray-800">$40.00</p>
                        <button className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg mt-4">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default ProductDetails;
