import React, { useEffect } from 'react'
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { deleteCategory, fetchAllCategories } from '../redux/reducers/products'
// import { loadUser } from '../redux/actions/user'

const AdminCategory = () => {


    const dispatch = useDispatch()
    const { loading, allCategories, deleteSuccess, deleteError } = useSelector(state => state.products)

    const deleteCategoryHandle = async (categoryId) => {
        await dispatch(deleteCategory(categoryId))
        toast.success('Category Deleted Successfully')
    }

    useEffect(() => {
        if (deleteSuccess) {
            toast.success('Category Deleted Successfully')
            dispatch(fetchAllCategories())
        }
        if (deleteError) {
            toast.error(deleteError)
        }
    }, [deleteSuccess, deleteError, dispatch])

    useEffect(() => {
        dispatch(fetchAllCategories())
    }, [dispatch, allCategories])

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom>
                        Categories
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} to="/admin/addcategory" sx={{ mb: 2 }}>
                        Add New Category
                    </Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Main Categories</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Sub Categories</TableCell>
                                    <TableCell sx={{ backgroundColor: '#1976d2', color: '#fff' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    allCategories.map((category) => (
                                        <TableRow key={category._id}>
                                            <TableCell>{category.category}</TableCell>
                                            <TableCell>{category.subCategory.join(', ')}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => deleteCategoryHandle(category._id)}
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

export default AdminCategory