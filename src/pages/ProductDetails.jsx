import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/Loader';
import { addToCart } from '../redux/actions/cartActions';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetProductDetailsQuery } from '../redux/productsApi';

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [hoveredVariationImage, setHoveredVariationImage] = useState(null);
    const [hoveredVariation, setHoveredVariation] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    
    // Use RTK Query instead of Redux
    const { data: product, isLoading: loading, error } = useGetProductDetailsQuery(id, {
        refetchOnMountOrArgChange: false,
    });

    // Check if variations have the new structure (objects with name, color, image)
    const hasNewVariationStructure = product?.variations?.length > 0 && 
        typeof product.variations[0] === 'object' && 
        product.variations[0] !== null;

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

    // New function to handle Buy Now button click
    const handleBuyNow = () => {
        dispatch(addToCart(id, quantity, selectedVariation));
        navigate('/shipping');
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

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
    };

    // Settings for React-Slick Slider
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: true,
        prevArrow: <div className="slick-arrow slick-prev bg-yellow-400 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 z-10 absolute left-2">←</div>,
        nextArrow: <div className="slick-arrow slick-next bg-yellow-400 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 z-10 absolute right-2">→</div>,
        beforeChange: (current, next) => setSelectedImageIndex(next),
        autoplay: false,
    };

    // Calculate discount percentage
    const discountPercentage = 30; // Hardcoded 30% discount
    const originalPrice = Math.ceil(product?.price * 1.3);

    // Function to render variations based on structure
    const renderVariations = () => {
        if (!product?.variations || product.variations.length === 0) {
            return null;
        }

        return (
            <div className='my-6'>
                <h3 className="text-base md:text-lg font-bold mb-3 flex items-center">
                    <span className="mr-2">Variations</span>
                    {selectedVariation && (
                        <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {typeof selectedVariation === 'string' 
                                ? selectedVariation 
                                : selectedVariation.name}
                        </span>
                    )}
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
                                className={`relative border-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    selectedVariation === variation 
                                        ? 'border-yellow-400 bg-yellow-50' 
                                        : 'border-gray-200 hover:border-yellow-300'
                                }`}
                                onClick={() => handleVariationClick(variation)}
                                onMouseEnter={() => !isOldStructure && handleVariationMouseEnter(variation)}
                                onMouseLeave={handleVariationMouseLeave}
                            >
                                {!isOldStructure && variation.image && variation.image.url ? (
                                    <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-md">
                                        <img 
                                            src={variation.image.url} 
                                            alt={variationName} 
                                            className="w-full h-full object-cover rounded-md transition-transform hover:scale-110"
                                        />
                                        {selectedVariation === variation && (
                                            <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
                                        )}
                                    </div>
                                ) : (
                                    <div 
                                        className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-md transition-transform hover:scale-105"
                                        style={{ backgroundColor: !isOldStructure && variation.color ? variation.color : '#f9fafb' }}
                                    >
                                        <span className="text-xs text-center font-medium px-1">
                                            {variationName}
                                        </span>
                                        {selectedVariation === variation && (
                                            <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
                                        )}
                                    </div>
                                )}
                                {!isOldStructure && (
                                    <div className="mt-2 text-center">
                                        <span className="text-xs font-semibold text-gray-700">PKR {variationPrice}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {/* Hovered Variation */}
                {hoveredVariation && (
                    <div className="mt-3 text-sm text-yellow-600 transition-all duration-300 bg-yellow-50 p-2 rounded-md">
                        <span className="font-medium">Preview:</span> {hoveredVariation.name}
                        {hoveredVariation.price > 0 && (
                            <span className="ml-2 font-semibold">PKR {hoveredVariation.price}</span>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-yellow-500">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-yellow-500">Products</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-700 font-medium truncate">{product?.name}</span>
            </div>

            {loading ? <Skeleton /> : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Section - Product Images */}
                        <div className="w-full lg:w-3/5 bg-gray-50">
                            <div className="relative h-full">
                                {/* Discount Badge */}
                                <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-white font-bold px-3 py-1 rounded-full shadow-md">
                                    -{discountPercentage}%
                                </div>
                                
                                {/* Hovered Variation Image Overlay */}
                                {hoveredVariationImage && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-90">
                                        <img
                                            src={hoveredVariationImage}
                                            alt="Variation Preview"
                                            className="max-h-[500px] object-contain p-4"
                                        />
                                    </div>
                                )}
                                
                                {/* Main Image Slider */}
                                <div className="px-4 pt-6 pb-2">
                                    <Slider ref={sliderRef} {...settings} className="product-slider mb-4">
                                        {product?.images?.map((img, index) => (
                                            <div key={img._id || index} className="outline-none">
                                                <div className="flex justify-center items-center h-[400px] md:h-[500px] bg-white rounded-lg p-4">
                                                    <img
                                                        src={img.url}
                                                        alt={`${product.name} - Image ${index + 1}`}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                    
                                    {/* Thumbnails */}
                                    {product?.images?.length > 1 && (
                                        <div className="flex justify-center space-x-2 mt-4 px-2">
                                            {product.images.map((img, index) => (
                                                <div 
                                                    key={`thumb-${index}`} 
                                                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                                                        selectedImageIndex === index ? 'border-yellow-400 shadow-md' : 'border-gray-200'
                                                    }`}
                                                    onClick={() => handleThumbnailClick(index)}
                                                >
                                                    <img 
                                                        src={img.url} 
                                                        alt={`Thumbnail ${index + 1}`} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Product Information */}
                        <div className="w-full lg:w-2/5 p-6 md:p-8 flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                {product?.name}
                            </h1>
                            
                            {/* Price Section with Discount */}
                            <div className="flex items-baseline mt-2 mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl md:text-3xl font-bold text-yellow-500">Rs. {product?.price}</span>
                                    <span className="text-lg text-gray-400 line-through">Rs. {originalPrice}</span>
                                </div>
                            </div>
                            
                            {/* Rating and Stock */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="flex text-yellow-400">
                                        <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
                                    </div>
                                    <span className="text-gray-600 ml-2 text-sm">(50 Reviews)</span>
                                </div>
                                {product?.stock > 0 ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                        In Stock ({product.stock})
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            
                            {/* Description */}
                            <div className="prose prose-sm text-gray-600 mb-6 max-h-32 overflow-y-auto custom-scrollbar">
                                <div dangerouslySetInnerHTML={{ __html: product?.description || '' }} />
                            </div>
                            
                            {/* Separator Line */}
                            <div className="h-px bg-gray-200 my-4"></div>
                            
                            {/* Variations */}
                            {renderVariations()}
                            
                            {/* Quantity Selector */}
                            <div className="mt-4 mb-6">
                                <h3 className="text-base font-bold mb-3">Quantity</h3>
                                <div className="flex items-center border border-gray-300 rounded-lg inline-flex">
                                    <button 
                                        onClick={decreaseQuantity} 
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                        disabled={quantity <= 1}
                                    >
                                        <span className="text-xl">−</span>
                                    </button>
                                    <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300">
                                        {quantity}
                                    </div>
                                    <button 
                                        onClick={increaseQuantity} 
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                        disabled={quantity >= product?.stock}
                                    >
                                        <span className="text-xl">+</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-3 mt-auto">
                                <button
                                    disabled={product?.stock < 1}
                                    onClick={addToCartHandler}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button
                                    disabled={product?.stock < 1}
                                    onClick={handleBuyNow}
                                    className="bg-gray-800 hover:bg-black text-white py-3 px-6 rounded-lg font-semibold transition-all"
                                >
                                    Buy Now
                                </button>
                            </div>
                            
                            {/* Shipping Info */}
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2v-.5a.5.5 0 01.5-.5H15V7.388A1.5 1.5 0 0114.5 6H13V5a1 1 0 00-1-1H9.414l-.757-.757A1 1 0 008.328 3H3z" />
                                    </svg>
                                    <span>Free delivery on orders over Rs. 1000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails; 