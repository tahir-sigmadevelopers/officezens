import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from "react-router-dom";
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
import { useEffect } from "react";
import axios from "axios";
import { server } from "./redux/constants";
import { userExist, userNotExist, syncWithStorage, getUser } from "./redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import Products from "./pages/Products";
import Shipping from "./pages/Shipping";
import ConfirmOrder from "./pages/ConfirmOrder";
import PaymentSuccess from "./pages/PaymentSuccess";
import JazzcashPayment from "./components/JazzcashPayment";
import PaymentMethodSelection from "./pages/PaymentMethodSelection";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ScrollToTop from "./components/ScrollToTop";

// Admin Imports 
import Dashboard from './admin/Dashboard';
import ProductList from "./admin/AdminProjects";
import NewProduct from "./admin/AddProject";
import NewCategory from "./admin/AddCategory";
import UpdateProduct from "./admin/UpdateProject";
import { HomeNavbar } from "./components/HomeBanner";
import AdminOrders from "./admin/AdminOrders";
import OrderDetails from "./admin/AdminOrderDetails";
import AdminCategory from "./admin/AdminCategory";

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const storedUser = localStorage.getItem('user');
  
  // Check both Redux state and localStorage
  return isAuthenticated || storedUser ? element : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();
  
  // Sync auth state when location changes (after navigation)
  useEffect(() => {
    dispatch(syncWithStorage());
  }, [location.pathname, dispatch]);

  // Determine if the current path is an admin path
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <HomeNavbar />} {/* Conditionally render Navbar */}
      
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
        <Route path="/payment-method" element={<PaymentMethodSelection />} />
        <Route path="/jazzcash/payment" element={<JazzcashPayment />} />

        {/* Admin Routes wrapped in PrivateRoute */}
        <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/admin/products" element={<PrivateRoute element={<ProductList />} />} />
        <Route path="/admin/categories" element={<PrivateRoute element={<AdminCategory />} />} />
        <Route path="/admin/addproduct" element={<PrivateRoute element={<NewProduct />} />} />
        <Route path="/admin/addcategory" element={<PrivateRoute element={<NewCategory />} />} />
        <Route path="/admin/orders" element={<PrivateRoute element={<AdminOrders />} />} />
        <Route path="/admin/order/:id" element={<PrivateRoute element={<OrderDetails />} />} />
        <Route path="/admin/product/:id" element={<PrivateRoute element={<UpdateProduct />} />} />
      </Routes>

      {!isAdminPath && (
        <>
          <ScrollToTop />
          <Footer />
        </>
      )}
    </>
  );
};

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f0f0f0',
    },
  },
});

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // On app load, ensure Redux state is synced with localStorage
  useEffect(() => {
    dispatch(syncWithStorage());
  }, [dispatch]);

  // Verify user token is still valid if user is logged in
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // First check if we have a user in redux state or localStorage
        const hasUser = user || localStorage.getItem('user');
        if (!hasUser) return;
        
        // If we have a user object with an ID, verify it with the server
        if (user?._id) {
          dispatch(getUser(user._id));
        } else {
          // Try to get user ID from localStorage
          try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser._id) {
              dispatch(getUser(storedUser._id));
            }
          } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            dispatch(userNotExist());
          }
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        dispatch(userNotExist());
      }
    };

    verifyUser();
  }, [dispatch, user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;