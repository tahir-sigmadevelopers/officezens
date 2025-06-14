// src/components/HomeNavbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const HomeNavbar = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const [userData, setUserData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();

    // Check both Redux state and localStorage for user data
    useEffect(() => {
        // First, check if we have user data in Redux state
        if (user && isAuthenticated) {
            setUserData(user);
            return;
        }

        // Otherwise, try to get user from localStorage
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            setUserData(null);
        }
    }, [user, isAuthenticated, location.pathname, cartItems.length]); // Re-check when cart items change

    const isUserLoggedIn = Boolean(userData);
    const isAdmin = userData && userData.role === "admin";

    const logoutHandler = () => {
        localStorage.removeItem("user");
        setUserData(null);
        toast.success("User logged out successfully");
        // Force a re-render by changing the location
        window.location.href = '/';
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-gray-900 to-gray-800 bg-opacity-90">
            {/* Mobile Menu Button */}
            <div className="md:hidden flex justify-between items-center py-2 px-4">
                <Link to="/" className="flex items-center">
                    <img src="/logo.jpg" alt="Relax Chair Logo" className="h-8 w-8 mr-2 rounded-full object-cover" />
                    <span className="text-white text-xl font-bold">Relax Chair</span>
                </Link>
                <div className="flex items-center space-x-3">
                    {/* Cart Icon with Badge */}
                    <Link to="/cart" className="text-white relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white p-2"
                    >
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} py-2 px-4`}>
                <div className="flex flex-col space-y-3">
                    <Link to="/" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Products</Link>
                    <Link to="/about" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link to="/contact" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                    <Link to="/cart" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Cart</Link>
                    
                    {!isUserLoggedIn ? (
                        <Link to="/login" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                    ) : (
                        <button onClick={() => {logoutHandler(); setIsMenuOpen(false);}} className="text-white hover:text-gray-300 text-left">Log Out</button>
                    )}
                    
                    {isAdmin && (
                        <Link to="/admin/dashboard" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                            Dashboard
                        </Link>
                    )}
                    
                    <div className="text-white py-1">📞 0317 5991373</div>
                </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex justify-between items-center py-2 px-8">
                <div className="flex space-x-4 pr-8">
                    <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                    <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
                    <Link to="/about" className="text-white hover:text-gray-300">About</Link>
                    <Link to="/contact" className="text-white hover:text-gray-300 w-28">Contact Us</Link>
                </div>
                
                <div className="overflow-hidden py-2 rounded-sm ml-2">
                    <div className="flex items-center">
                       
                        <div className="overflow-hidden rounded-sm">
                            <div className="scroll-text text-white font-semibold">
                                <p className="uppercase">Pakistan's largest office furniture brand</p>
                                <p className="uppercase">Within Lahore provide the same day delivery</p>
                                <p className="uppercase">Other cities delivery time will be 4 to 5 working days</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-6 px-4 ml-4">
                    <Link to="/cart" className="text-white hover:text-gray-300 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                    
                    {!isUserLoggedIn ? (
                        <Link to="/login" className="text-white hover:text-gray-300 w-28 py-2">Log In</Link>
                    ) : (
                        <button onClick={logoutHandler} className="text-white hover:text-gray-300 w-28 py-2">Log Out</button>
                    )}
                    
                    {isAdmin && (
                        <Link to="/admin/dashboard" className="text-white hover:text-gray-300">
                            Dashboard
                        </Link>
                    )}
                    
                    <div className="text-white w-36 py-1">📞 0317 5991373</div>
                </div>
            </div>
        </div>
    );
};


const Carousel = () => {
    return (
        <div className="mt-14 md:mt-12">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
            >
                <SwiperSlide>
                    <div className="relative w-full">
                        <img src="/bg-1.jpg" alt="Chair 3" className="w-full object-cover h-auto md:h-[80vh] lg:h-screen" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full">
                        <img src="/bg-2.jpg" alt="Chair 3" className="w-full object-cover h-auto md:h-[80vh] lg:h-screen" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full">
                        <img src="/bg-3.jpg" alt="Chair 1" className="w-full object-cover h-auto md:h-[80vh] lg:h-screen" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full">
                        <img src="/bg-4.jpg" alt="Chair 2" className="w-full object-cover h-auto md:h-[80vh] lg:h-screen" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full">
                        <img src="/bg-5.jpg" alt="Chair 3" className="w-full object-cover h-auto md:h-[80vh] lg:h-screen" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                    </div>
                </SwiperSlide>
            </Swiper>

            {/* WhatsApp Icon */}
            <div className="fixed bottom-4 right-4 md:right-6 z-40">
                <a href="https://wa.me/+923175991373" target="_blank" rel="noopener noreferrer">
                    <img src="/whatsapp.png" alt="whatsapp" className="w-10 md:w-12 hover:scale-110 transition-all" />
                </a>
            </div>
        </div>
    );
};

export default Carousel;