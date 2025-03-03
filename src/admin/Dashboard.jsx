import React, { useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { fetchProducts } from '../redux/reducers/products';
// import { fetchOrders } from '../redux/reducers/orders';
// import { fetchUsers } from '../redux/reducers/users'; // Assuming you have a users reducer

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: products } = useSelector(state => state.products);
  // const { orders } = useSelector(state => state.orders);
  // const { users } = useSelector(state => state.users); // Assuming you have a users slice

  useEffect(() => {
    dispatch(fetchProducts());
    // dispatch(fetchOrders());
    // dispatch(fetchUsers()); // Fetch users if you have this action
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography variant="h6">Total Products</Typography>
                <Typography variant="h4">{products?.length}</Typography>
              </Paper>
            </Grid>
            {/* <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography variant="h6">Total Orders</Typography>
                <Typography variant="h4">{orders.length}</Typography>
              </Paper>
            </Grid> */}
            {/* <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{users.length}</Typography>
              </Paper>
            </Grid> */}
            {/* Add more cards as needed */}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;