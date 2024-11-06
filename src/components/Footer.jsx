// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="p-10 bg-gray-900 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and subscription */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Office Zens</h2>
          <p>Subscribe to our newsletter for the latest updates and exclusive offers.</p>
          <div className="flex mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-l-md text-gray-800"
            />
            <button className="p-2 bg-yellow-500 text-white rounded-r-md">Subscribe</button>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-2">
          <Link to={"/"} className="text-gray-400 hover:text-gray-300">Home</Link>
          <Link to={"/contact"} className="text-gray-400 hover:text-gray-300">Contact</Link>
          <Link to={"/about"} className="text-gray-400 hover:text-gray-300">About</Link>
          <Link to={"/products"} className="text-gray-400 hover:text-gray-300">Shop</Link>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-white">Follow Us</h3>
          <div className="flex  flex-col mt-2">
            <a href="https://facebook.com" className="text-gray-400 hover:text-gray-300">Facebook</a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-gray-300">Instagram</a>
            <a href="https://x.com" className="text-gray-400 hover:text-gray-300">Twitter</a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-gray-300">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 border-t border-gray-700 pt-4">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} office zens. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
