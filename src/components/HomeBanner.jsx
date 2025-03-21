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
    const [userData, setUserData] = useState(null);
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
    }, [user, isAuthenticated, location.pathname]); // Re-check when location changes (navigation occurs)

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
        <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-2 px-8 bg-gradient-to-b from-gray-900 to-gray-800 bg-opacity-90 mb-8">
            <div className="flex space-x-4 pr-8">
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
                <Link to="/about" className="text-white hover:text-gray-300">About</Link>
                <Link to="/contact" className="text-white hover:text-gray-300 w-28">Contact Us</Link>
               
            </div>
            
            <div className="overflow-hidden py-2 rounded-sm ml-2">
                <div className="overflow-hidden rounded-sm">
                    <div className="scroll-text text-white font-semibold">
                        <p className="uppercase">Pakistan's largest office furniture brand</p>
                        <p className="uppercase">Within Lahore provide the same day delivery</p>
                        <p className="uppercase">Other cities delivery time will be 4 to 5 working days</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center space-x-6 px-4 ml-4">
                <Link to="/cart" className="text-white hover:text-gray-300">Cart</Link>
                
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
    );
};


const Carousel = () => {
    return (
        <div className="mt-8">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
            >
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/bg-1.jpg" alt="Chair 3" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        {/* <div className="absolute inset-0 flex items-center justify-center">
                            {/* <h2 className="text-white text-4xl font-bold">Welcome to Our Collection</h2> */}
                            {/* <p className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</p>
                        </div>  */}
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/bg-2.jpg" alt="Chair 3" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        {/* <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</p>
                        </div> */}
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/bg-3.jpg" alt="Chair 1" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        {/* <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</p>
                        </div> */}
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/bg-4.jpg" alt="Chair 2" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        {/* <div className="absolute inset-0 flex items-center justify-center">
                            <h2 className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</h2>
                        </div> */}
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/bg-5.jpg" alt="Chair 3" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        {/* <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</p>
                        </div> */}
                    </div>
                </SwiperSlide>
            </Swiper>

            {/* WhatsApp Icon */}
            <div className="fixed bottom-4 right-6">
                <a href="https://wa.me/+923175991373" target="_blank" rel="noopener noreferrer">
                    <img src="/whatsapp.png" alt="whatsapp" className=" w-12 hover:scale-110 transition-all" />
                </a>
            </div>
        </div>
    );
};

export default Carousel;