import React, { useState, useEffect } from "react";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { addCategory } from "../redux/reducers/products";

const AddCategory = () => {
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([""]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.products);

  const handleSubCategoryChange = (index, value) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index] = value;
    setSubCategories(updatedSubCategories);
  };

  const addCategorySubmit = async (e) => {
    e.preventDefault();
    await dispatch(addCategory({ category, subCategory: subCategories }));
    toast.success(message);
    navigate("/admin/categories");
  };

  const addSubCategoryField = () => {
    setSubCategories([...subCategories, ""]);
  };

  useEffect(() => {

    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Add Category
          </Typography>
          <form onSubmit={addCategorySubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Category"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Main Category"
                  required
                />
              </Grid>
              {subCategories.map((subCategory, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={`Sub Category ${index + 1}`}
                    fullWidth
                    value={subCategory}
                    onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                    placeholder="Sub Category"
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button onClick={addSubCategoryField} variant="outlined">
                  Add More Subcategories
                </Button>
              </Grid>
              <Grid item xs={12}>
                {loading ? (
                  <Skeleton length={2} />
                ) : (
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Create
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default AddCategory;
