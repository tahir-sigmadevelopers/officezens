import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetails, updateOrder } from "../redux/actions/orderAction";
import { Box, Button, Card, CardContent, Chip, Container, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";

const OrderDetails = () => {
    const dispatch = useDispatch();
    const { loading, order, error, message } = useSelector(state => state.orders);
    const [updating, setUpdating] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getOrderDetails(params.id));
    }, [dispatch, params.id]);

    useEffect(() => {
        if (order) {
            console.log("Order data:", order);
        }
    }, [order]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "clearError" });
        }
        if (message) {
            toast.success(message);
            dispatch({ type: "clearMessage" });
        }
    }, [error, message, dispatch]);

    const handleProcessOrder = async () => {
        setUpdating(true);
        try {
            await dispatch(updateOrder(params.id));
            dispatch(getOrderDetails(params.id)); // Refresh order details
        } catch (error) {
            toast.error(error?.message || "Failed to update order");
        } finally {
            setUpdating(false);
        }
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

    // Get next status label
    const getNextStatusLabel = (currentStatus) => {
        switch (currentStatus) {
            case "Processing":
                return "Mark as Shipped";
            case "Shipped":
                return "Mark as Delivered";
            case "Delivered":
                return "Already Delivered";
            default:
                return "Update Status";
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex' }}>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container>
                        <Typography variant="h6">Loading order details...</Typography>
                    </Container>
                </Box>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box sx={{ display: 'flex' }}>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container>
                        <Typography variant="h6">Order not found</Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => navigate('/admin/orders')}
                            sx={{ mt: 2 }}
                        >
                            Back to Orders
                        </Button>
                    </Container>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4">
                            Order Details
                        </Typography>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate('/admin/orders')}
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
                                        <Typography variant="body1">{order._id}</Typography>
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Placed On</Typography>
                                        <Typography variant="body1">{formatDate(order.createdAt)}</Typography>
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Status</Typography>
                                        <Chip 
                                            label={order.orderStatus} 
                                            color={getStatusColor(order.orderStatus)} 
                                            size="small" 
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Payment</Typography>
                                        <Typography variant="body1">Cash on Delivery</Typography>
                                    </Box>

                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth
                                        disabled={order.orderStatus === "Delivered" || updating}
                                        onClick={handleProcessOrder}
                                        sx={{ mt: 2 }}
                                    >
                                        {getNextStatusLabel(order.orderStatus)}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Customer Info */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Customer Information</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Customer</Typography>
                                        <Typography variant="body1">
                                            {order.user ? order.user.name : 
                                             order.guestInfo ? (order.guestInfo.email || "Guest") : "Guest"}
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Email</Typography>
                                        <Typography variant="body1">
                                            {order.user ? order.user.email : 
                                             order.guestInfo ? order.guestInfo.email : "N/A"}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Shipping Address</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Typography variant="body1">
                                        {order?.shippingInfo?.address},<br />
                                        {order?.shippingInfo?.city}, {order?.shippingInfo?.state}<br />
                                        Phone: {order?.shippingInfo?.phoneNo}
                                    </Typography>
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
                                        <Typography variant="body1">Rs. {order.itemsPrice?.toFixed(0) || 0}</Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">Shipping:</Typography>
                                        <Typography variant="body1">Rs. {order.shippingCharges?.toFixed(0) || 0}</Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">Tax:</Typography>
                                        <Typography variant="body1">Rs. {order.tax?.toFixed(0) || 0}</Typography>
                                    </Box>
                                    
                                    <Divider sx={{ my: 1 }} />
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6">Total:</Typography>
                                        <Typography variant="h6" color="primary">Rs. {order.total?.toFixed(0) || 0}</Typography>
                                    </Box>
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                                        <Typography variant="body1">Cash on Delivery</Typography>
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
                                        {order?.orderItems?.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <img 
                                                        src={item?.image} 
                                                        alt={item?.name} 
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                                    />
                                                </TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="right">Rs. {item?.price?.toFixed(0)}</TableCell>
                                                <TableCell align="right">{item?.quantity}</TableCell>
                                                <TableCell align="right">Rs. {(item?.price * item?.quantity)?.toFixed(0)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default OrderDetails;
