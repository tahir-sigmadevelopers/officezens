// CartPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

const CartPage = () => {


    // const [quantity, setQuantity] = useState(1);

    const dispatch = useDispatch();

    const { product } = useSelector((state) => state.productDetails);

    const { cartItems } = useSelector((state) => state.cart);

    const { isAuthenticated } = useSelector((state) => state.auth);

    const increaseCart = (id, quantity, stock) => {
        if (stock <= quantity) return;
        let qty = quantity + 1;
        dispatch(addToCart(id, qty));
    };

    const decreaseCart = (id, quantity) => {
        if (quantity <= 1) return;
        let qty = quantity - 1;
        dispatch(addToCart(id, qty));
    };


    const totalPrice = cartItems.reduce((accumulator, currentItem) => {
        const itemPrice = currentItem.price * currentItem.quantity;
        return accumulator + itemPrice;
    }, 0);

    console.log(cartItems);

    const navigate = useNavigate();
    const checkOutHandler = () => {
        if (!isAuthenticated) {
            navigate("/login?redirect=shipping");
        } else {
            navigate("/shipping");
        }
    };



    const removeFromCartHandler = (id) => {
        // dispatch(removeFromCart(id));
        localStorage.removeItem("cartItems")
        toast.success("Item Removed From Cart");
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen mt-10">
            {/* Page Title */}
            <h2 className="text-3xl font-semibold mb-2">Your Shopping</h2>
            <p className="text-gray-600 mb-8">Home / My Cart</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:pb-8">
                {/* Cart Items Section */}
                {
                    cartItems.length < 1 && <div className='flex lg:col-span-2 flex-col gap-8 justify-center items-center'>
                        <h3 className=' text-3xl lg:col-span-2 '>No Items In Cart</h3>
                        <Link to="/products" className="py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 ">Continue Shopping</Link>
                    </div>
                }
                {
                    cartItems.length > 0 && <div className="lg:col-span-2 ">
                        <div className="flex justify-between border-b pb-4 mb-4">
                            <span className="text-lg font-semibold">Items</span>
                            <span className="text-lg font-semibold">Price</span>
                        </div>

                        {/* Individual Cart Item */}
                        {cartItems && cartItems?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-4 border-b">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item?.image}
                                        alt="Product"
                                        className="w-20 h-20 rounded-lg"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold">{item.name}</h3>
                                        <p className="text-gray-500">{item.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src="/trash.png"
                                        alt="Del"
                                        className='w-6 hover:bg-gray-200 rounded-lg cursor-pointer'
                                        onClick={removeFromCartHandler}
                                    />
                                    <div className="flex items-center border rounded-lg">
                                        <button onClick={() => decreaseCart(item.id, item.quantity)} className="px-3 py-1 text-gray-600">-</button>

                                        <input
                                            type="number"
                                            value={item.quantity}
                                            className="w-12 text-center border-l border-r outline-none bg-gray-50"
                                            readOnly
                                        />

                                        <button onClick={() => increaseCart(item.id, item.quantity, item.stock)}
                                            className="px-3 py-1 text-gray-600">+</button>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-700">Rs. {item.quantity * item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                }

                {/* Order Summary Section */}
                <div className="bg-gray-50 p-6 shadow rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                    <div className="flex justify-between text-gray-600 mb-2">
                        <span>Subtotal</span>
                        <span>{totalPrice}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 mb-4">
                        <span>Delivery Fee</span>
                        <span>{totalPrice > 10000 && 500}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mb-6">
                        <span>Total</span>
                        <span>Rs.{totalPrice > 10000 ? totalPrice + 500 : totalPrice}</span>
                    </div>
                    <button
                        // onClick={checkOutHandler}
                        className="w-full bg-black hover:opacity-85 text-white py-2 rounded-lg mb-4">
                        <a href="https://wa.me/+923175991373" target="_blank" rel="noopener noreferrer">
                            Go to Checkout
                        </a>

                    </button>
                    <button className="w-full border hover:bg-gray-100  border-gray-300 text-gray-700 py-2 rounded-lg">
                        <Link to={"/products"} >  Continue Shopping  </Link>
                    </button>
                </div>
            </div>






            {/* Suggested Products Section */}
            {/* <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-4">You May Like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 shadow rounded-lg">
                            <img
                                src="https://www.jiomart.com/images/product/original/rvcdgazzao/tekavo-office-table-computer-desk-pc-laptop-study-writing-table-for-home-office-100-l-x60-product-images-orvcdgazzao-p600060325-1-202304011032.jpg?im=Resize=(420,420)"
                                alt="Product"
                                className="w-full  object-cover rounded-lg mb-4"
                            />
                            <h4 className="text-lg font-semibold mb-2">Comfortable Soft Chair</h4>
                            <p className="text-gray-500 mb-2">$40.00</p>
                            <button className="w-full bg-black hover:opacity-85 text-white py-2 rounded-lg">
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default CartPage;
