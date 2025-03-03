import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../redux/reducers/product-details';
import toast from 'react-hot-toast';
import { Skeleton } from './Loader';
import { addToCart } from '../redux/actions/cartActions';
import parse from 'react-html-parser';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);

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
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity <= 1) return;
        setQuantity(quantity - 1);
    };

    const addToCartHandler = () => {
        dispatch(addToCart(id, quantity));
        toast.success("Item Added to Cart");
    };

    // Settings for React-Slick Slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        prevArrow: <div className="slick-arrow slick-prev bg-blue-600 text-white p-2 rounded-full">←</div>,
        nextArrow: <div className="slick-arrow slick-next bg-blue-600 text-white p-2 rounded-full">→</div>,
        autoplay: true,
        autoplaySpeed: 2000,
    };


    return (
        <div className="container mx-auto py-10 px-4 lg:px-12 mt-8">
            <div className="text-sm text-gray-500 mb-4">
                Home / List of Products / {product && product?.name}
            </div>

            {loading ? <Skeleton /> : (
                <>
                    <div className="flex flex-wrap">
                        {/* Left Section - Product Images */}
                        <div className="w-full lg:w-1/2 flex flex-col">
                            <div className="mb-4">
                                {/* Image Carousel */}
                                <Slider {...settings}>
                                    {product?.images?.map((img) => (
                                        <div key={img._id}>
                                            <img
                                                src={img.url}
                                                alt="Product"
                                                className="rounded-lg w-full h-[550px] object-contain"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        {/* Right Section - Product Information */}
                        <div className="w-full lg:w-1/2 lg:pl-10 mt-10 lg:mt-0">
                            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                                {product?.name}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {parse(product?.description || '')}
                            </p>

                            <div className='my-3'>
                                <h3 className="text-lg font-bold">Variations:</h3>
                                <ul className="list-disc pl-5">
                                    {product?.variations?.map((variation, index) => (
                                        <li key={index} className="text-green-700">
                                            {variation}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-800 mb-4">
                                <span className="text-2xl font-semibold"> Rs.{product?.price}</span>
                                <span className="text-gray-400 line-through">Rs. {Math.ceil(product?.price * 1.3)}</span>
                            </div>

                            {/* Rating and Stock */}
                            <div className="flex items-center mb-4">
                                <span className="text-yellow-500">★★★★☆</span>
                                <span className="text-gray-600 ml-2">(50 Reviews)</span>
                                {product?.stock > 0 ? <span className="ml-4 text-green-500">In Stock</span> : <span className="ml-4 text-red-500">Out of Stock</span>}
                            </div>

                            {/* Quantity and Buttons */}
                            <div className="flex items-center mb-6">
                                <button onClick={decreaseQuantity} className="px-4 py-2 bg-gray-200">-</button>
                                <input
                                    type="number"
                                    value={quantity}
                                    className="w-12 text-center border border-gray-300 p-2 rounded-lg m-1"
                                    readOnly
                                />
                                <button onClick={increaseQuantity} className="px-4 py-2 bg-gray-200">+</button>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    disabled={product?.stock < 1}
                                    onClick={addToCartHandler}
                                    className="bg-black hover:bg-gray-900 text-white py-2 px-6 rounded-lg">
                                    Add To Cart
                                </button>
                                <Link to={"/cart"} className="bg-gray-300 hover:bg-gray-200 text-black py-2 px-6 rounded-lg">
                                    Buy Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetails;
