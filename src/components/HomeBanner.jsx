// src/components/HomeNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
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
        <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-2 px-8 bg-gradient-to-b from-gray-900 to-gray-800 bg-opacity-90 mb-8">

            <div className="flex space-x-8 ">
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
                <Link to="/about" className="text-white hover:text-gray-300">About</Link>
                <Link to="/contact" className="text-white hover:text-gray-300 w-24">Contact Us</Link>
            </div>
            <div className="overflow-hidden py-2 rounded-sm ml-2">
                <div className="overflow-hidden rounded-sm ">
                    <div className="scroll-text text-white font-semibold">
                        <p className="uppercase">Pakistan's largest office furniture brand</p>
                        <p className="uppercase">Within Lahore provide the same day delivery </p>
                        <p className="uppercase">Other cities delivery time will be 4 to 5 working days</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-6 px-4 ml-4">
                <Link to="/cart" className="text-white hover:text-gray-300">Cart</Link>
                {!user && !isAuthenticated ? (
                    <Link to="/login" className="text-white hover:text-gray-300 w-28 py-2">Log In</Link>
                ) : (
                    <button onClick={logoutHandler} className="text-white hover:text-gray-300 w-28 py-2">Log Out</button>
                )}
                {user && user.role === "admin" && isAuthenticated && (
                    <Link to="/admin/dashboard" className="text-white hover:text-gray-300">
                        Dashboard
                    </Link>
                )}
                <div className="text-white w-32 py-1">📞 0317 5991373</div>
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
                        <img src="/new1.jpg" alt="Chair 3" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* <h2 className="text-white text-4xl font-bold">Welcome to Our Collection</h2> */}
                            <p className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</p>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/new2.png" alt="Chair 3" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</p>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/new3.jpg" alt="Chair 1" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</p>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/new4.jpg" alt="Chair 2" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h2 className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</h2>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <img src="/new5.jpg" alt="Chair 3" className="w-full h-screen object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white px-5 text-lg w-[70vw] text-center font-bold">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.</p>
                        </div>
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