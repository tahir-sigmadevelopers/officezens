// src/components/FashionTrends.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FashionTrends = () => {
  return (
    <section className="body-font bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 md:pr-16 flex flex-col md:items-start md:text-left mb-8 md:mb-0 items-center text-center gap-3 md:gap-5">
          <h2 className="title-font text-xl sm:text-3xl md:text-4xl mb-2 md:mb-4 font-bold">Enjoy Our Latest Fashion Trends and Style
            {/* <br className="hidden lg:inline-block">readymade gluten */}
          </h2>
          <p className="mb-2 md:mb-3 leading-relaxed text-sm md:text-base">High-quality office furniture enhances comfort and productivity, supporting long hours of work with ergonomic design. Durable and stylish, it also elevates the professional atmosphere of any workspace.</p>
          <p className="mb-2 md:mb-3 leading-relaxed text-sm md:text-base">Durable office furniture withstands daily use, maintaining its functionality and appearance over time. Investing in quality materials ensures long-term value and reduces the need for frequent replacements.</p>
          <button className="px-4 py-2 md:px-4 md:py-3 bg-black text-white rounded-full text-sm md:text-base">
            <Link to={"/products"}>Explore More &rarr;</Link>
          </button>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <img className="object-cover object-center rounded-lg h-64 md:h-80 lg:h-96 w-full" alt="hero" src="/latest.jpg" />
        </div>
      </div>
    </section>
  );
};

export default FashionTrends;
