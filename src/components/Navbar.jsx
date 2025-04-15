// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();

  // Check both Redux state and localStorage for user data
  useEffect(() => {
    // First, check if we have user data in Redux state
    if (user && isAuthenticated) {
      setUserData(user);
      return;
    }

    // Otherwise, try to get user from localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      setUserData(null);
    }
  }, [user, isAuthenticated, location.pathname]); // Re-check when location changes (navigation occurs)

  const isUserLoggedIn = Boolean(userData);
  const isAdmin = userData && userData.role === 'admin';

  const logoutHandler = () => {
    localStorage.removeItem('user');
    setUserData(null);
    toast.success('User logged out successfully');
    // Force a re-render by changing the location
    window.location.href = '/';
  };

  return (
    <nav className="flex items-center justify-between p-6 bg-white shadow-md">
      <div className="text-2xl font-bold">Relax Chair</div>
      <ul className="flex space-x-8 text-black font-semibold">
        <Link to={"/"}>Home</Link>
        <Link to={"/products"}>Shop</Link>
        <Link to={"/about"}>About Us</Link>
        <Link to={"/contact"}>Contact Us</Link>
        
      </ul>
      <div className="flex space-x-4">
        <Link to={"/cart"} className="px-8 py-2 font-semibold bg-yellow-400 text-white rounded-lg hover:bg-yellow-500">
          Cart
        </Link>
        
        {!isUserLoggedIn ? (
          <Link to={"/login"} className="px-4 py-2 font-semibold bg-yellow-400 hover:bg-yellow-500 outline-none text-white rounded-lg">
            Log in
          </Link>
        ) : (
          <button onClick={logoutHandler} className="px-4 py-2 font-semibold bg-yellow-400 hover:bg-yellow-500 outline-none text-white rounded-lg">
            Log Out
          </button>
        )}

        {isAdmin && (
          <Link to={"/admin/dashboard"} className="px-4 py-2 font-semibold text-white bg-yellow-400 hover:bg-yellow-500 rounded-lg">
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
