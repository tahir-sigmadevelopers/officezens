// src/components/Navbar.jsx
import React from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    localStorage.removeItem('user');
    toast.success(`User logged Out`)
  };

  return (
    <nav className="flex items-center justify-between p-6 bg-white shadow-md">
      <div className="text-2xl font-bold ">Office Zens</div>
      <ul className="flex space-x-8 text-black font-semibold">
        <Link to={"/"}>Home</Link>
        <Link to={"/products"}>Shop</Link>
        <Link to={"/about"}>About Us</Link>
        <Link to={"/contact"}>Contact Us</Link>
      </ul>
      <div className="flex space-x-4">
        <Link to={"/cart"} className="px-8 py-2 font-semibold bg-yellow-400 text-white rounded-lg hover:bg-yellow-500" >Cart</Link>
        {
          !user && !isAuthenticated ? <Link to={"/login"} className="px-4 py-2 font-semibold bg-yellow-400  hover:bg-yellow-500 outline-none text-white rounded-lg">Log in</Link> :
            <button onClick={logoutHandler} className="px-4 py-2 font-semibold bg-yellow-400  hover:bg-yellow-500 outline-none text-white rounded-lg">Log Out</button>


        }
        {/* apply logout here  */}



        {/* <button className="px-4 py-2 font-semibold text-white bg-yellow-500 rounded-full">Get Started</button> */}
        {user && user?.role === "admin" && isAuthenticated && (
          <Link to={"/admin/dashboard"} className="px-4 py-2 font-semibold text-white bg-yellow-400  hover:bg-yellow-500 rounded-full">
            Dashboard
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
