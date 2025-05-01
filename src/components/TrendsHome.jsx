// src/components/LatestTrends.jsx
import React from 'react';
import { Skeleton } from './Loader';
import { Link } from 'react-router-dom';
import { useGetOldProductsQuery } from '../redux/productsApi';

const LatestTrends = () => {
  // Use RTK Query instead of Redux dispatch
  const { data: oldItems, isLoading: oldLoading, error: oldError } = useGetOldProductsQuery(undefined, {
    refetchOnMountOrArgChange: false, // Don't refetch when component remounts if data exists
  });

  return (
    <section className="px-4 py-8 md:p-10 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Discover the Latest Trends</h2>
      <p className="mt-2 text-sm md:text-base text-gray-600 text-center px-2">
        Stay updated with our information and engaging blog posts about modern furniture and fashion in the industry.
      </p>
      {oldLoading ? <Skeleton length={6} /> :
        <>
          <div className="mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {
              oldItems && oldItems?.map(product => (
                <div className="p-3 md:p-4 border rounded-lg shadow hover:shadow-md transition-shadow" key={product?._id}>
                  <Link to={`/product/${product?._id}`} className="block">
                    <img 
                      src={product?.images[0]?.url} 
                      alt="Trend" 
                      className="w-full h-40 md:h-60 object-contain bg-white rounded-md" 
                      loading="lazy" // Add lazy loading
                    />
                    <h3 className="mt-2 text-sm md:text-lg font-semibold mb-1 text-gray-800 truncate">{product?.name}</h3>
                    <div className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: product?.description.slice(0, 100) + (product?.description?.length > 100 ? "..." : "") || '' }} />

                    <div className="flex items-center justify-between">
                      <h3 className="mt-1 text-sm md:text-lg font-semibold text-yellow-600">Rs. {product?.price}</h3>
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                        -30%
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 line-through">Rs. {Math.round(product?.price * 1.3)}</div>
                  </Link>
                </div>
              ))
            }
          </div>
        </>
      }
    </section>
  );
};

export default LatestTrends;
