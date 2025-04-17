// src/components/SuccessHistory.jsx
import React from 'react';

const SuccessHistory = () => {
  return (
    <section className="px-4 py-8 md:p-10 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Success History of Our Customer</h2>
      <p className="mt-2 text-sm md:text-base text-gray-600 text-center">
        Emphasize time-saving and use numbers to maximize credibility.
      </p>
      <div className="mt-6 md:mt-8 grid grid-cols-2 md:flex md:flex-row items-center justify-around">
        <div className="p-3 md:p-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-yellow-500">10x</h3>
          <p className="text-sm md:text-base text-gray-800">Increase in productivity</p>
        </div>
        <div className="p-3 md:p-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-yellow-500">300%</h3>
          <p className="text-sm md:text-base text-gray-800">Return on investment</p>
        </div>
        <div className="p-3 md:p-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-yellow-500">5k+</h3>
          <p className="text-sm md:text-base text-gray-800">Happy customers</p>
        </div>
        <div className="p-3 md:p-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-yellow-500">100+</h3>
          <p className="text-sm md:text-base text-gray-800">5-star reviews</p>
        </div>
      </div>
    </section>
  );
};

export default SuccessHistory;
