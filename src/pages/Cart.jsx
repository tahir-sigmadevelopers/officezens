// CartPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

const CartPage = () => {
    const dispatch = useDispatch();
    const { product } = useSelector((state) => state.productDetails);
    const { cartItems } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

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

    const navigate = useNavigate();
    const checkOutHandler = () => {
        // Allow all users to proceed to shipping, regardless of authentication
        navigate("/shipping");
    };

    const removeFromCartHandler = (id) => {
        console.log("Removing item with ID:", id);

        // Check if the item exists in cartItems 
        const itemExists = cartItems.find(item => item.id === id);

        if (!itemExists) {
            console.error("Item not found in cart:", id);
            toast.error("Item not found in cart");
            return;
        }

        dispatch(removeFromCart(id));

        // Also remove the item from selected items if it was selected
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        }

        toast.success("Item Removed From Cart");
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        if (newSelectAll) {
            // Select all items
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            // Deselect all items
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            // Deselect the item
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
            setSelectAll(false);
        } else {
            // Select the item
            setSelectedItems([...selectedItems, id]);

            // Check if all items are now selected
            if (selectedItems.length + 1 === cartItems.length) {
                setSelectAll(true);
            }
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            toast.error("No items selected");
            return;
        }

        if (selectedItems.length === cartItems.length) {
            localStorage.removeItem("cartItems");
            window.location.reload();
        } else {
            selectedItems.forEach(id => {
                dispatch(removeFromCart(id));
            });
            setSelectedItems([]);
            toast.success("Selected items removed from cart");
        }
    };

    return (
        <div className="p-4 py-8 sm:p-6 md:p-8 bg-gray-50 min-h-screen mt-6 md:mt-10">
            <div className="max-w-7xl mx-auto">
                {cartItems.length < 1 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-xl md:text-3xl text-gray-500 font-medium mt-4">Your Cart is Empty</h3>
                        <Link to="/products" className="mt-6 py-2 md:py-3 px-6 md:px-8 bg-yellow-500 text-white text-sm md:text-base rounded-lg hover:bg-yellow-400 transition-colors">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-xl md:text-2xl font-bold">Shopping Cart ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)</h1>
                            <button onClick={() => navigate('/products')} className="text-yellow-500 hover:text-yellow-600 font-medium">
                                Continue Shopping
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
                            {/* Cart Items */}
                            <div className="lg:col-span-9 ">
                                <div className="bg-white rounded-lg shadow-sm ">
                                    <div className="p-4 border-b">
                                        <div className="flex justify-between ">
                                            <label className="flex items-center text-sm font-medium text-gray-700 ">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 mr-2"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                                SELECT ALL ({cartItems.length} ITEM{cartItems.length !== 1 ? 'S' : ''})
                                            </label>
                                            <button
                                                className="text-gray-500 hover:text-red-500 text-sm flex items-center"
                                                onClick={handleDeleteSelected}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                DELETE
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cart Item List */}
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="p-4 border-b last:border-0  bg-white">
                                            <div className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 mt-1 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 mr-3"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => handleSelectItem(item.id)}
                                                />

                                                <div className="flex flex-1 space-x-4">
                                                    {/* Product Image */}
                                                    <div className="relative">
                                                      <Link to={`/product/${item.id}`}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                                        />
                                                        </Link>
                                                        {item.variation && (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">
                                                                V
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0 flex flex-col">
                                                        <Link to={`/product/${item.id}`}>
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                                                                {item.variation && (
                                                                    <div className="mt-1 text-xs text-gray-500"><span className='font-bold'>Variation:</span>
                                                                        {item.variation.name}
                                                                        {item.variation.color && (
                                                                            <span className="ml-1 w-2 h-2 rounded-full inline-block align-middle"
                                                                                style={{ backgroundColor: item.variation.color }}></span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                            </div>

                                                            <div className="text-right">
                                                                <div className="font-medium text-yellow-600">Rs. {item.price.toFixed(0)}</div>
                                                                <div className="text-xs text-gray-500 line-through">Rs. {Math.round(item.price * 1.3)}</div>
                                                            </div>
                                                        </div>

                                                        </Link>
                                                        {/* Quantity and Actions */}
                                                        <div className="flex justify-between items-end mt-2 pt-2">
                                                            <div className="flex items-center border rounded-md">
                                                                <button
                                                                    onClick={() => decreaseCart(item.id, item.quantity)}
                                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                                >
                                                                    −
                                                                </button>
                                                                <input
                                                                    type="text"
                                                                    value={item.quantity}
                                                                    readOnly
                                                                    className="w-10 text-center border-x py-1 text-sm"
                                                                />
                                                                <button
                                                                    onClick={() => increaseCart(item.id, item.quantity, item.stock)}
                                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <div>
                                                                <button
                                                                    onClick={() => removeFromCartHandler(item.id)}
                                                                    className="text-gray-400 hover:text-red-500"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)</span>
                                            <span>Rs. {totalPrice.toFixed(0)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping Fee</span>
                                            <span className={totalPrice > 10000 ? "text-gray-600" : "text-green-600"}>
                                                {totalPrice > 10000 ? `Rs. 500` : "Free"}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t mt-2">
                                            <div className="flex justify-between font-medium">
                                                <span>Total</span>
                                                <span className="text-yellow-600">Rs. {(totalPrice > 10000 ? totalPrice + 500 : totalPrice).toFixed(0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={checkOutHandler}
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md font-medium mt-6 transition-colors"
                                    >
                                        PROCEED TO CHECKOUT ({cartItems.length})
                                    </button>

                                    <div className="mt-6 flex flex-col space-y-2">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <span>Location</span>
                                            <div className="flex-1 border-b border-dotted mx-2"></div>
                                        </div>
                                        <div className="flex items-center text-xs">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Pakistan (Delivery available nationwide)</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>100% Secure Payment</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">COD</span>
                                                {/* <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">JazzCash</span> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
