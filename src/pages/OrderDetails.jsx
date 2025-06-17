import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getOrderDetails } from '../redux/actions/orderAction';
import { Box, Button, Card, CardContent, Chip, Container, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { ArrowBack } from '@mui/icons-material';

const OrderDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, order, error } = useSelector(state => state.orders);
    const { isAuthenticated } = useSelector(state => state.auth);
    const params = useParams();
    const [searchParams] = useSearchParams();
    const guestEmail = searchParams.get('email');


    useEffect(() => {
        console.log(order.order);
        // Check if user is authenticated or has guest email
        if (!isAuthenticated && !guestEmail) {
            toast.error("Please login to view order details");
            navigate('/login');
            return;
        }
        
        // Pass email parameter for guest orders
        dispatch(getOrderDetails(params.id, guestEmail));
    }, [dispatch, params.id, isAuthenticated, navigate, guestEmail]);

    useEffect(() => {
        

        if (error) {
            toast.error(error);
            dispatch({ type: "clearError" });
        }
    }, [error, dispatch]);

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
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
                <Typography>Loading order details...</Typography>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
                <Typography>Order not found</Typography>
                <Button 
                    component={Link} 
                    to={guestEmail ? `/orders?email=${encodeURIComponent(guestEmail)}` : "/orders"}
                    startIcon={<ArrowBack />}
                    sx={{ mt: 2 }}
                >
                    Back to Orders
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Order Details
                </Typography>
                <Button 
                    component={Link} 
                    to={guestEmail ? `/orders?email=${encodeURIComponent(guestEmail)}` : "/orders"}
                    startIcon={<ArrowBack />}
                    variant="outlined"
                >
                    Back to Orders
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Order Summary</Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Order ID</Typography>
                                <Typography variant="body1">{order?.order?._id}</Typography>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Placed On</Typography>
                                <Typography variant="body1">{formatDate(order?.order?.createdAt)}</Typography>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Status</Typography>
                                <Chip 
                                    label={order?.order?.orderStatus} 
                                    color={getStatusColor(order?.order?.orderStatus)} 
                                    size="small" 
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Payment</Typography>
                                <Typography variant="body1">{order?.order?.paymentInfo?.status || "N/A"}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Shipping Info */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {order?.order?.shippingInfo ? (
                                <Typography variant="body1">
                                    {order?.order?.shippingInfo?.address},<br />
                                    {order?.order?.shippingInfo?.city}, {order?.order?.shippingInfo?.state}<br />
                                    Phone: {order?.order?.shippingInfo?.phoneNo}
                                </Typography>
                            ) : (
                                <Typography variant="body1">
                                    Shipping information not available
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Payment Details */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Payment Details</Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Subtotal:</Typography>
                                <Typography variant="body1">Rs. {order?.order?.itemsPrice?.toFixed(0) || 0}</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Shipping:</Typography>
                                <Typography variant="body1">Rs. {order?.order?.shippingCharges?.toFixed(0) || 0}</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Tax:</Typography>
                                <Typography variant="body1">Rs. {order?.order?.tax?.toFixed(0) || 0}</Typography>
                            </Box>
                            
                            <Divider sx={{ my: 1 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6" color="primary">Rs. {order?.order?.total?.toFixed(0) || 0}</Typography>
                            </Box>
                            
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                                <Typography variant="body1">
                                    {order?.order?.paymentInfo?.id.startsWith('COD') ? 'Cash on Delivery' : order?.order?.paymentInfo?.id}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order?.order?.orderItems?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                            />
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell align="right">Rs. {item.price.toFixed(0)}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="right">Rs. {(item.price * item.quantity).toFixed(0)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OrderDetails; 