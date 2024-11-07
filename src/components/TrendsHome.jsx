// src/components/LatestTrends.jsx
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { fetchOldProducts } from '../redux/reducers/products';
import { Skeleton } from './Loader';
import { Link } from 'react-router-dom';

const LatestTrends = () => {



  const dispatch = useDispatch();

  const { oldItems, latestLoading, latestError } = useSelector((state) => state.products);



  useEffect(() => {
    dispatch(fetchOldProducts());
  }, [dispatch]);

  const addToCartHandler = (id, quantity) => {
    dispatch(addToCart(id, quantity));
    toast.success("Item Added to Cart");
  };

  return (
    <section className="p-10 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Discover the Latest Trends</h2>
      <p className="mt-2 text-gray-600 text-center">
        Stay updated with our information and engaging blog posts about modern furniture and fashion in the industry.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">


        {latestLoading ? <Skeleton /> : <>
          {
            oldItems && oldItems?.map(product => (
              <div className="p-4 border rounded-lg shadow" key={product?._id}>
                <Link to={`/product/${product?._id}`}>
                  <img src={product?.images[0].url} alt="Trend" className="w-full rounded-md" />
                </Link>
                <h3 className="mt-2 text-lg font-semibold mb-2 text-gray-800">{product?.name}</h3>
                <p className="text-gray-600">{product?.description}</p>
              </div>
            ))}
        </>
        }



      </div>
    </section>
  );
};

export default LatestTrends;
