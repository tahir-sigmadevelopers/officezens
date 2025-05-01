import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../redux/reducers/product-details';
import toast from 'react-hot-toast';
import { Skeleton } from './Loader';
import { addToCart } from '../redux/actions/cartActions';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [hoveredVariationImage, setHoveredVariationImage] = useState(null);
    const [hoveredVariation, setHoveredVariation] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);
    const sliderRef = useRef(null);

    // Check if variations have the new structure (objects with name, color, image)
    const hasNewVariationStructure = product?.variations?.length > 0 && 
        typeof product.variations[0] === 'object' && 
        product.variations[0] !== null;

    useEffect(() => {
        dispatch(fetchProductDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Set the first variation as selected when product loads
    useEffect(() => {
        if (product && product.variations && product.variations.length > 0) {
            setSelectedVariation(product.variations[0]);
        }
    }, [product]);

    console.log(product);
    const increaseQuantity = () => {
        if (quantity >= product.stock) return;
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity <= 1) return;
        setQuantity(quantity - 1);
    };

    const addToCartHandler = () => {
        dispatch(addToCart(id, quantity, selectedVariation));
        toast.success("Item Added to Cart");
    };

    const handleVariationClick = (variation) => {
        setSelectedVariation(variation);
    };

    const handleVariationMouseEnter = (variation) => {
        if (variation.image && variation.image.url) {
            setHoveredVariationImage(variation.image.url);
            setHoveredVariation(variation);
        }
    };

    const handleVariationMouseLeave = () => {
        setHoveredVariationImage(null);
        setHoveredVariation(null);
    };

    // Settings for React-Slick Slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        prevArrow: <div className="slick-arrow slick-prev bg-blue-600 text-white p-2 rounded-full">←</div>,
        nextArrow: <div className="slick-arrow slick-next bg-blue-600 text-white p-2 rounded-full">→</div>,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    // Function to render variations based on structure
    const renderVariations = () => {
        if (!product?.variations || product.variations.length === 0) {
            return null;
        }

        return (
            <div className='my-5'>
                <h3 className="text-lg font-bold mb-3">
                    Variations: {' '}
                    <span className={hoveredVariation ? 'text-blue-600 transition-colors duration-300' : ''}>
                        {hoveredVariation 
                            ? `${hoveredVariation.name} - PKR.${hoveredVariation.price || 0}` 
                            : (hasNewVariationStructure 
                                ? `${selectedVariation?.name || ''} - PKR.${selectedVariation?.price || 0}` 
                                : '')}
                    </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                    {product.variations.map((variation, index) => {
                        // Handle both old (string) and new (object) variation structures
                        const isOldStructure = typeof variation === 'string';
                        const variationName = isOldStructure ? variation : variation.name;
                        const variationPrice = isOldStructure ? 0 : (variation.price || 0);
                        
                        return (
                            <div
                                key={index}
                                className={`border px-3 py-1 rounded cursor-pointer ${
                                    selectedVariation === variation ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                }`}
                                onClick={() => handleVariationClick(variation)}
                                onMouseEnter={() => !isOldStructure && handleVariationMouseEnter(variation)}
                                onMouseLeave={handleVariationMouseLeave}
                            >
                                {!isOldStructure && variation.image && variation.image.url ? (
                                    <div className="relative w-14">
                                        <img 
                                            src={variation.image.url} 
                                            alt={variationName} 
                                            className="w-full h-full object-cover rounded"
                                        />
                                       
                                    </div>
                                ) : (
                                    <div 
                                        className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded"
                                        style={{ backgroundColor: !isOldStructure && variation.color ? variation.color : '#f3f4f6' }}
                                    >
                                        <span className="text-xs text-center block w-full overflow-hidden text-ellipsis whitespace-nowrap px-1">
                                            {variationName}
                                        </span>
                                    </div>
                                )}
                                {!isOldStructure && <span className="ml-2 text-blue-600">PKR. {variationPrice}</span>}
                            </div>
                        );
                    })}
                </div>
                
                {/* Selected Variation */}
                {selectedVariation && !hoveredVariation && (
                    <div className="mt-3 text-gray-700">
                        Selected: <span className="font-semibold">
                            {typeof selectedVariation === 'string' 
                                ? selectedVariation 
                                : selectedVariation.name}
                        </span>
                    </div>
                )}
                
                {/* Hovered Variation */}
                {hoveredVariation && (
                    <div className="mt-3 text-blue-600 transition-all duration-300">
                        Previewing: <span className="font-semibold">{hoveredVariation.name}</span>
                        {hoveredVariation.color && (
                            <span className="ml-2">
                                (Color: <span className="font-semibold">{hoveredVariation.color}</span>)
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
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
                            <div className="mb-4 relative">
                                {/* Hovered Variation Image Overlay */}
                                {hoveredVariationImage && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white rounded-lg">
                                        <img
                                            src={hoveredVariationImage}
                                            alt="Variation Preview"
                                            className="rounded-lg w-full h-[550px] object-contain"
                                        />
                                    </div>
                                )}
                                
                                {/* Image Carousel */}
                                <Slider ref={sliderRef} {...settings}>
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
                            <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: product?.description || '' }} />

                            {/* Variations with Images */}
                            {renderVariations()}

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
