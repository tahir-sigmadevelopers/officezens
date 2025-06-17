import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../redux/actions/orderAction';
import { Box, Button, Chip, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField } from '@mui/material';
import { Visibility, Search } from '@mui/icons-material';
import toast from 'react-hot-toast';

const UserOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, orders, error } = useSelector(state => state.myOrders);
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [guestEmail, setGuestEmail] = useState('');
    const [showGuestForm, setShowGuestForm] = useState(!isAuthenticated);

    useEffect(() => {
        // If user is authenticated, fetch their orders automatically
        if (isAuthenticated) {
            dispatch(getMyOrders());
            setIsLoading(false);
        } else {
            // Check if there's a saved guest email in localStorage
            const savedGuestEmail = localStorage.getItem('guestOrderEmail');
            if (savedGuestEmail) {
                setGuestEmail(savedGuestEmail);
                dispatch(getMyOrders(savedGuestEmail));
                setIsLoading(false);
            } else {
                // Just set loading to false, will show the guest form
                setIsLoading(false);
            }
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "clearError" });
        }
    }, [error, dispatch]);

    const handleGuestOrderSearch = () => {
        if (!guestEmail || !guestEmail.trim()) {
            toast.error("Please enter your email address");
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }
        
        // Save the guest email for future use
        localStorage.setItem('guestOrderEmail', guestEmail);
        
        // Fetch orders using the guest email
        dispatch(getMyOrders(guestEmail));
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "Processing":
                return "warning";
            case "Shipped":
                return "info";
            case "Delivered":
                return "success";
            default:
                return "default";
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Guest order lookup form
    const renderGuestOrderForm = () => {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                py: 8,
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
                mb: 4
            }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Find your orders using your email</Typography>
                <Box sx={{ display: 'flex', width: '100%', maxWidth: '500px', mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="Enter the email you used for your order"
                        sx={{ mr: 1 }}
                    />
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleGuestOrderSearch}
                        startIcon={<Search />}
                    >
                        Find
                    </Button>
                </Box>
                {isAuthenticated && (
                    <Button 
                        variant="text" 
                        color="primary"
                        onClick={() => setShowGuestForm(false)}
                        sx={{ mt: 2 }}
                    >
                        View my account orders instead
                    </Button>
                )}
            </Box>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                My Orders
            </Typography>

            {/* Toggle between guest and account orders if authenticated */}
            {isAuthenticated && (
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => setShowGuestForm(!showGuestForm)}
                    >
                        {showGuestForm ? "View my account orders" : "Find guest orders"}
                    </Button>
                </Box>
            )}

            {/* Show guest form if requested or if not authenticated */}
            {showGuestForm && renderGuestOrderForm()}

            {/* Show orders if not in guest form mode or if authenticated */}
            {(!showGuestForm || (showGuestForm && guestEmail)) && (
                <>
                    {loading || isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <Typography>Loading your orders...</Typography>
                        </Box>
                    ) : orders && orders.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Order ID</TableCell>
                                        <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Date</TableCell>
                                        <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Items</TableCell>
                                        <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Amount</TableCell>
                                        <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order._id} hover>
                                            <TableCell>{order._id.substring(0, 8)}...</TableCell>
                                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={order.orderStatus} 
                                                    color={getStatusColor(order.orderStatus)} 
                                                    size="small" 
                                                />
                                            </TableCell>
                                            <TableCell>{order.orderItems.length}</TableCell>
                                            <TableCell>Rs. {order.total.toFixed(0)}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    component={Link} 
                                                    to={`/order/${order._id}${!isAuthenticated ? `?email=${encodeURIComponent(guestEmail)}` : ''}`} 
                                                    startIcon={<Visibility />}
                                                    size="small"
                                                    variant="outlined"
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            py: 8,
                            backgroundColor: '#f9f9f9',
                            borderRadius: 2
                        }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>No orders found</Typography>
                            <Button 
                                component={Link} 
                                to="/products" 
                                variant="contained" 
                                color="primary"
                            >
                                Browse Products
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default UserOrders; 