// src/components/HomeSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomeSection = () => {
    return (
        <>
            <section className="body-font">
                <div className="container mx-auto flex px-10 py-8 md:flex-row flex-col items-center">
                    <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center gap-5">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold">Workspace Essentials For Every Office Style
                            <img className='pl-3' src="/Brush.png" alt="brush" />
                        </h1>
                        <p className="mb-3 leading-relaxed">Upgrade your workspace with our modern office furniture, designed for comfort, style, and productivity. Find desks, chairs, and storage solutins perfect for any office.
                        </p>
                        <button className="inline-flex bg-black text-white border-0 py-2 px-12 focus:outline-none rounded text-lg"><Link to={"/products"} >Explore More &rarr;</Link></button>

                    </div>
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                        <img className="object-cover object-center rounded-lg lg:ml-24 lg:h-[25rem]" alt="hero" src="/home-banner.webp" />
                    </div>
                </div>
            </section>
            {/* Scrolling Text */}
            <div className="overflow-hidden px-40 mt-6 bg-yellow-500 py-2 rounded-sm">
                <div className="scroll-text text-white font-semibold">
                    HOME DELIVERY IS AVAILABLE ALL OVER PAKISTAN.
                </div>
            </div>
        </>
    );
};

export default HomeSection;
