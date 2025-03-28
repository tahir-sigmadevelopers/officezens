import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { login, userExist, userNotExist } from '../redux/reducers/auth';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(login({ email, password }));
            
            if (login.fulfilled.match(result)) {
                const payload = result.payload;
                if (payload && payload.user) {
                    // First update the Redux state
                    dispatch(userExist(payload.user));
                    
                    // Then update localStorage
                    localStorage.setItem("user", JSON.stringify(payload.user));
                    
                    // Show success message
                    toast.success("Login successful!");
                    
                    // Navigate to home page
                    setTimeout(() => {
                        navigate("/");
                        // Optional: Force page reload to ensure all components update
                        // window.location.reload();
                    }, 300);
                }
            } else if (login.rejected.match(result)) {
                const errorMessage = result.payload?.message || 'Login failed. Please check your credentials.';
                toast.error(errorMessage);
                dispatch(userNotExist());
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred during login.';
            toast.error(errorMessage);
            dispatch(userNotExist());
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 mt-8">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='username' />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" autoComplete='current-password' className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            {/* <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                            </div> */}
                            <button 
                                type="submit" 
                                className="w-full text-white bg-black hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                            <p className="text-sm font-light dark:text-gray-400">
                                Don&apos;t have an account yet? <Link to={"/signup"} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login