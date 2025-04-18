// src/components/LatestTrends.jsx
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { Skeleton } from './Loader';
import { Link } from 'react-router-dom';
import { useGetOldProductsQuery } from '../redux/productsApi';

const LatestTrends = () => {
  const dispatch = useDispatch();

  // Use RTK Query instead of Redux dispatch
  const { data: oldItems, isLoading: oldLoading, error: oldError } = useGetOldProductsQuery(undefined, {
    refetchOnMountOrArgChange: false, // Don't refetch when component remounts if data exists
  });

  const addToCartHandler = (id, quantity) => {
    dispatch(addToCart(id, quantity));
    toast.success("Item Added to Cart");
  };

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
                <div className="p-3 md:p-4 border rounded-lg shadow" key={product?._id}>
                  <Link to={`/product/${product?._id}`}>
                    <img 
                      src={product?.images[0]?.url} 
                      alt="Trend" 
                      className="w-full h-32 md:h-48 object-cover rounded-md" 
                      loading="lazy" // Add lazy loading
                    />
                  </Link>
                  <h3 className="mt-2 text-sm md:text-lg font-semibold mb-1 text-gray-800 truncate">{product?.name}</h3>
                  <div className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: product?.description.slice(0, 100) + (product?.description?.length > 100 ? "..." : "") || '' }} />

                  <h3 className="mt-1 text-sm md:text-lg font-semibold text-gray-800">Rs. {product?.price}</h3>

                  <button onClick={() => addToCartHandler(product?._id, 1)} className="w-full mt-1 px-3 py-1 md:px-4 md:py-2 bg-yellow-500 text-white text-xs md:text-base rounded-full hover:bg-yellow-600 transition-colors">Add to Cart</button>
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
