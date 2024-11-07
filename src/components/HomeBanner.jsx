// src/components/HomeNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const HomeNavbar = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const logoutHandler = () => {
        localStorage.removeItem("user");
        toast.success("User logged out");
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-4 px-8 bg-gradient-to-b from-gray-900 to-gray-800 bg-opacity-90">
            <div className="flex space-x-8">
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
                <Link to="/about" className="text-white hover:text-gray-300">About</Link>
                <Link to="/contact" className="text-white hover:text-gray-300">Contact Us</Link>
            </div>
            <div className="flex items-center space-x-4">
                <Link to="/cart" className="text-white hover:text-gray-300">Cart</Link>
                {!user && !isAuthenticated ? (
                    <Link to="/login" className="text-white hover:text-gray-300">Log In</Link>
                ) : (
                    <button onClick={logoutHandler} className="text-white hover:text-gray-300">Log Out</button>
                )}
                {user && user.role === "admin" && isAuthenticated && (
                    <Link to="/admin/dashboard" className="text-white hover:text-gray-300">
                        Dashboard
                    </Link>
                )}
                {/* <div className="text-white">📞 0334 1288993</div> */}
            </div>
        </div>
    );
};

const Carousel = () => {
    return (
        <div className="mt-8"> {/* Adjusted margin to account for fixed navbar */}
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
            >
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/home-bg-1.jpg" alt="Chair 1" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/home-bg-2.jpg" alt="Chair 2" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/home-bg-3.jpg" alt="Chair 3" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                </SwiperSlide>
            </Swiper>
            {/* WhatsApp Icon */}
            <div className="fixed bottom-4 right-6">
                <a href="https://wa.me/+923175991373" target="_blank" rel="noopener noreferrer">
                    <img src="/whatsapp.png" alt="whatsapp"  className=" w-12 hover:scale-110 transition-all" />
                </a>
            </div>
        </div>
    );
};

export default Carousel;
