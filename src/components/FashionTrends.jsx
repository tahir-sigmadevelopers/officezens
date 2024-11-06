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
          <p className="mb-3 leading-relaxed">Ship our curated collection of fashion items and stay ahead of the fashion game.

            <div className="mt-8 flex flex-col md:flex-row justify-around items-center">
              <div className="text-center md:text-left md:w-1/2 p-4">
                <h3 className="text-xl font-semibold text-gray-800">Quality</h3>
                <p className="text-gray-600">
                  Our fashion items are crafted with the highest materials and attention to details.
                </p>
              </div>
              <div className="text-center md:text-left md:w-1/2 p-4">
                <h3 className="text-xl font-semibold text-gray-800">Style</h3>
                <p className="text-gray-600">
                  Express your unique style with our wide range of trendy items.
                </p>
              </div>
            </div>
          </p>
          <button className="px-4 py-3 bg-black text-white rounded-full "><Link to={"/products"} >Explore More &rarr;</Link> </button>

        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img className="object-cover object-center rounded-lg lg:ml-24 lg:h-[25rem]" alt="hero" src="/fashion.png" />
        </div>
      </div>
    </section>

  );
};

export default FashionTrends;
