import React, { useEffect } from 'react'
import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
// import { deleteProject, getAllProjects } from '../redux/actions/project'
import { deleteProduct, fetchProducts } from '../redux/reducers/products'
import { Skeleton } from '../components/Loader'
import { getAdminOrders } from '../redux/actions/orderAction'
import Sidebar from './Sidebar'

const AdminOrders = () => {
    const dispatch = useDispatch()
    const { loading, orders, deleteError, deleteMessage } = useSelector(state => state.orders)

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError)
        }
        if (deleteMessage) {
            toast.success(deleteMessage)
        }

        dispatch(getAdminOrders())
    }, [deleteError, deleteMessage, dispatch])

    console.log(orders);
    

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom>
                        Orders
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders?.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell>{order._id}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                            <TableCell>{order.total}</TableCell>
                                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))
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