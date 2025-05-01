// src/components/Products.jsx
import React from 'react';
import { Skeleton } from './Loader';
import { Link } from 'react-router-dom';
import { useGetLatestProductsQuery } from '../redux/productsApi';

const ProductsHome = () => {
  // Use RTK Query instead of Redux dispatch
  const { data: latestProducts, isLoading: latestLoading, error: latestError } = useGetLatestProductsQuery(undefined, {
    refetchOnMountOrArgChange: false, // Don't refetch when component remounts if data exists
  });

  return (
    <section className="px-4 py-8 md:p-10 bg-gray-50">
      {latestLoading ? <Skeleton /> : <>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Quality Office Furniture to Match Your Vision</h2>
        <p className="mt-2 text-sm md:text-base text-gray-600 text-center px-2">
          Transform your workspace with stylish, ergonomic office furniture that boosts productivity and comfort.
        </p>
        <div className="mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {
            latestProducts && latestProducts?.map(product => (
              <div className="p-3 md:p-4 border rounded-lg shadow hover:shadow-md transition-shadow" key={product?._id}>
                <Link to={`/product/${product?._id}`} className="block">
                  <img 
                    src={product?.images && product?.images[0]?.url} 
                    alt={product?.name} 
                    className="w-full h-40 md:h-60 object-contain bg-white rounded-md"
                    loading="lazy" // Add lazy loading
                  />
                  <h3 className="mt-2 text-sm md:text-lg font-semibold mb-1 text-gray-800 truncate">{product?.name}</h3>

                  <div className="flex items-center justify-between">
                    <h3 className="mt-1 text-sm md:text-lg font-semibold text-yellow-600">Rs. {product?.price}</h3>
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                      -30%
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 line-through">Rs. {Math.round(product?.price * 1.3)}</div>
                  <div className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: product?.description.slice(0, 100) + (product?.description?.length > 100 ? "..." : "") || '' }} />
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

export default ProductsHome;
