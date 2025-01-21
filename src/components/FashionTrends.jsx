// src/components/FashionTrends.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FashionTrends = () => {
  return (

    <section className="body-font lg:pl-12 bg-gray-50">
      <div className="lg:pl-12 container mx-auto flex px-10 py-8 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center gap-5">
          <h2 className="title-font sm:text-4xl text-2xl mb-4 font-bold">Enjoy Our Latest Fashion Trends and Style
            {/* <br className="hidden lg:inline-block">readymade gluten */}
          </h2>
          <p className="mb-3 leading-relaxed">High-quality office furniture enhances comfort and productivity, supporting long hours of work with ergonomic design. Durable and stylish, it also elevates the professional atmosphere of any workspace.

         
          </p>
          <p className="mb-3 leading-relaxed">Durable office furniture withstands daily use, maintaining its functionality and appearance over time. Investing in quality materials ensures long-term value and reduces the need for frequent replacements.    </p>
          <button className="px-4 py-3 bg-black text-white rounded-full "><Link to={"/products"} >Explore More &rarr;</Link> </button>

        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img className="object-cover object-center rounded-lg lg:ml-24 lg:h-[25rem]" alt="hero" src="/latest.jpg" />
        </div>
      </div>
    </section>

  );
};

export default FashionTrends;
