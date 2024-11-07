// src/components/Products.jsx
import React, { useEffect } from 'react';
import { fetchLatestProducts } from '../redux/reducers/products';
import { Skeleton } from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/actions/cartActions';
import toast from 'react-hot-toast';

const ProductsHome = () => {


  const dispatch = useDispatch();

  const { latestItems: latestProducts, latestLoading, latestError } = useSelector((state) => state.products);



  useEffect(() => {
    dispatch(fetchLatestProducts());
  }, [dispatch]);

  const addToCartHandler = (id, quantity) => {
    dispatch(addToCart(id, quantity));
    toast.success("Item Added to Cart");
  };


  return (
    <section className="p-10 bg-gray-50">
      {latestLoading ? <Skeleton /> : <>
        <h2 className="text-3xl font-bold text-gray-800 text-center">Quality Office Furniture to Match Your Vision</h2>
        <p className="mt-2 text-gray-600 text-center">
          Transform your workspace with stylish, ergonomic office furniture that boosts productivity and comfort.
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {
            latestProducts && latestProducts?.map(product => (
              <div className="p-4 border rounded-lg shadow" key={product._id}>
                <Link to={`/product/${product?._id}`} >
                  <img src={product?.images[0].url} alt={product?.name} className="w-full rounded-md" />
                </Link>
                <h3 className="mt-2 text-lg font-semibold text-gray-800">{product?.price}</h3>
                <button onClick={() => addToCartHandler(product._id, 1)} className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-full">Add to Cart</button>
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
