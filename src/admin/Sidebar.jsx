import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Home, Category, ShoppingCart, People, AddBox } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/admin/dashboard">
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/admin/products">
          <ListItemIcon><Category /></ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        {/* <ListItem button component={Link} to="/admin/orders">
          <ListItemIcon><ShoppingCart /></ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem> */}
        <ListItem button component={Link} to="/admin/categories">
          <ListItemIcon><AddBox /></ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
        {/* <ListItem button component={Link} to="/admin/users">
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem> */}
      </List>
    </Drawer>
  );
};

export default Sidebar;