// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <nav className="bg-white shadow-md">
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src="/logo.jpg" alt="Relax Chair Logo" className="h-8 w-8 mr-2 rounded-full object-cover" />
          <div className="text-xl font-bold">HelloRelax Chair</div>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-black p-2"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} py-2 px-4 bg-white`}>
        <div className="flex flex-col space-y-3">
          <Link to="/" className="py-2 font-semibold" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" className="py-2 font-semibold" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/about" className="py-2 font-semibold" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="py-2 font-semibold" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          
          <div className="py-2">
            <Link to="/cart" className="block w-full py-2 text-center font-semibold bg-yellow-400 text-white rounded-lg hover:bg-yellow-500" onClick={() => setIsMenuOpen(false)}>
              Cart
            </Link>
          </div>
          
          <div className="py-2">
            {!isUserLoggedIn ? (
              <Link to="/login" className="block w-full py-2 text-center font-semibold bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg" onClick={() => setIsMenuOpen(false)}>
                Log in
              </Link>
            ) : (
              <button onClick={() => {logoutHandler(); setIsMenuOpen(false);}} className="w-full py-2 text-center font-semibold bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg">
                Log Out
              </button>
            )}
          </div>
          
          {isAdmin && (
            <div className="py-2">
              <Link to="/admin/dashboard" className="block w-full py-2 text-center font-semibold bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex md:items-center md:justify-between md:p-6">
        <div className="flex items-center">
          <img src="/logo.jpg" alt="Relax Chair Logo" className="h-10 w-10 mr-3 rounded-full object-cover" />
          <div className="text-2xl font-bold">Hi Relax Chair</div>
        </div>
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
      </div>
    </nav>
  );
};

export default Navbar;
