import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ProductDetails from "./components/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "./redux/constants";
import { userExist, userNotExist } from "./redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import Products from "./pages/Products";
import Shipping from "./pages/Shipping";
import ConfirmOrder from "./pages/ConfirmOrder";
import Payment from "./pages/Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import PaymentSuccess from "./pages/PaymentSuccess";

// Admin Imports 
import Dashboard from './admin/Dashboard';
import ProductList from "./admin/AdminProjects";
import NewProduct from "./admin/AddProject";
import UpdateProduct from "./admin/UpdateProject";
import { HomeNavbar } from "./components/HomeBanner";
import AdminOrders from "./admin/AdminOrders";
import OrderDetails from "./admin/AdminOrderDetails";

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  const user = localStorage.getItem('user');
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const [stripeApiKey, setStripeApiKey] = useState("");

  const getStripeApiKey = async () => {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApiKey);
  };

  useEffect(() => {
    getStripeApiKey();
  }, [stripeApiKey]);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      if (!user || !user._id) {
        return;
      }

      try {
        const response = await axios.get(`${server}/user/${user._id}`);
        if (response.data && response.data.user) {
          dispatch(userExist(response.data.user));
        } else {
          dispatch(userNotExist());
        }
      } catch (error) {
        console.error('Error checking user:', error);
        dispatch(userNotExist());
      }
    };

    checkUser();
  }, [dispatch]);

  return (
    <>
      <Router>
        <HomeNavbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/confirmorder" element={<ConfirmOrder />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/payment/process"
            element={
              stripeApiKey && (
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              )
            } />

          {/* Admin Routes wrapped in PrivateRoute */}
          <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/admin/products" element={<PrivateRoute element={<ProductList />} />} />
          <Route path="/admin/addproduct" element={<PrivateRoute element={<NewProduct />} />} />
          <Route path="/admin/orders" element={<PrivateRoute element={<AdminOrders />} />} />
          <Route path="/admin/order/manage/:id" element={<PrivateRoute element={<OrderDetails />} />} />
          <Route path="/admin/product/:id" element={<PrivateRoute element={<UpdateProduct />} />} />
        </Routes>

        <Footer />
      </Router>

      <Toaster />
    </>
  )
}

export default App