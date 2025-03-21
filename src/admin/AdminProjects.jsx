import React, { useEffect } from 'react'
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
// import { deleteProject, getAllProjects } from '../redux/actions/project'
import { deleteProduct, fetchProducts } from '../redux/reducers/products'
import { Skeleton } from '../components/Loader'
// import { loadUser } from '../redux/actions/user'
import Sidebar from './Sidebar'

const AdminProjects = () => {

    const dispatch = useDispatch()
    const { loading, items: products, deleteSuccess, deleteError } = useSelector(state => state.products)



    const deleteProductHandle = async (productId) => {
        await dispatch(deleteProduct(productId))
        toast.success('Product Deleted Successfully')
        dispatch(fetchProducts())
    }

    useEffect(() => {
        if (deleteSuccess) {
            toast.success('Product Deleted Successfully')
            dispatch(fetchProducts())
        }
        if (deleteError) {
            toast.error(deleteError)
        }
    }, [deleteSuccess, deleteError, dispatch])

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom>
                        Products
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} to="/admin/addproduct" sx={{ mb: 2 }}>
                        Add New Product
                    </Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Name</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Price</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Category</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Edit</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Delete</TableCell>
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
                                    products?.map((product) => (
                                        <TableRow key={product?._id}>
                                            <TableCell>{product?.name}</TableCell>
                                            <TableCell>{product?.price}</TableCell>
                                            <TableCell>{product?.category}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    component={Link}
                                                    to={`/admin/product/${product?._id}`}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => deleteProductHandle(product._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
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

export default AdminProjects