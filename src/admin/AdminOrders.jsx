import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { Visibility, Delete } from '@mui/icons-material'
import { deleteOrder, getAdminOrders } from '../redux/actions/orderAction'
import Sidebar from './Sidebar'

const AdminOrders = () => {
    const dispatch = useDispatch()
    const { loading, orders, error, message } = useSelector(state => state.orders)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        dispatch(getAdminOrders())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch({ type: "clearError" })
        }
        if (message) {
            toast.success(message)
            dispatch({ type: "clearMessage" })
        }
    }, [error, message, dispatch])

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            setIsDeleting(true)
            try {
                await dispatch(deleteOrder(orderId))
                dispatch(getAdminOrders())
            } catch (error) {
                toast.error("Failed to delete order")
            } finally {
                setIsDeleting(false)
            }
        }
    }

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "Processing":
                return "warning"
            case "Shipped":
                return "info"
            case "Delivered":
                return "success"
            default:
                return "default"
        }
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom>
                        Orders Management
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Order ID</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Customer</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Status</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Amount</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Date</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : orders && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell>{order._id.substring(0, 8)}...</TableCell>
                                            <TableCell>
                                                {order.user ? order.user.name : 
                                                 order.guestInfo ? (order.guestInfo.email || "Guest") : "Guest"}
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={order.orderStatus} 
                                                    color={getStatusColor(order.orderStatus)} 
                                                    size="small" 
                                                />
                                            </TableCell>
                                            <TableCell>Rs. {order.total.toFixed(0)}</TableCell>
                                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    component={Link} 
                                                    to={`/admin/order/${order._id}`} 
                                                    color="primary"
                                                >
                                                    <Visibility />
                                                </IconButton>
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => handleDeleteOrder(order._id)}
                                                    disabled={isDeleting}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
        </Box>
    )
}

export default AdminOrders