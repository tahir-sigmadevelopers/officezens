import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { createProduct, fetchAllCategories } from '../redux/reducers/products'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const AddProduct = () => {

    const [name, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [variations, setVariations] = useState([""])
    const [category, setCategory] = useState("")
    const [subCategory, setSubCategory] = useState("")
    const [price, setprice] = useState(0)
    const [stock, setStock] = useState(0)
    const [images, setImages] = useState([]);

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const { createError, message, createLoading, allCategories } = useSelector(state => state.products)

    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages((old) => [...old, reader.result]); // Store base64 strings
                }
            };

            reader.readAsDataURL(file); // Convert file to base64
        });
    };

    const addProjectSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.set("name", name);
        data.set("description", description);
        data.set("category", category);
        data.set("subCategory", subCategory);
        data.set("price", price);
        data.set("stock", stock);
        data.set("variations", variations);

        images.forEach((image) => {
            data.append("images", image); // Append base64 strings
        });

        dispatch(createProduct(data));
        if (!createError) {
            toast.success(message);
            setTitle("");
            setDescription("");
            setCategory("");
            setprice(0);
            setStock(0);
            setImages([]);
            setVariations("");
            navigate("/admin/products");
        } else {
            toast.error("Error Creating product");
        }
    };

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    const handleVariationsChange = (index, value) => {
        const updatedVariations = [...variations];
        updatedVariations[index] = value; // Ensure each variation is a separate string in the array
        console.log(updatedVariations);
        setVariations(updatedVariations);
    };

    const addVariationsField = () => {
        setVariations([...variations, ""]); // Adds an empty string to the array for a new variation
    };
    // Get the subcategories for the selected category
    const selectedCategory = allCategories.find(cat => cat?.category === category);

    const subCategories = selectedCategory ? selectedCategory?.subCategory : [];

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="md">
                    <Typography variant="h4" gutterBottom>
                        Add Product
                    </Typography>
                    <form onSubmit={addProjectSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={setDescription}
                                    style={{ height: '200px', paddingBottom: '25px', width: '100%' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    // label="Category"
                                    fullWidth
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {allCategories?.map((cat) => (
                                        <option key={cat._id} value={cat.category}>
                                            {cat.category}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    // label="Sub Category"
                                    fullWidth
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    required
                                >
                                    <option value="">Select Sub Category</option>
                                    {subCategories?.map((subCat, index) => (
                                        <option key={index} value={subCat}>
                                            {subCat}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    value={price}
                                    onChange={(e) => setprice(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Stock"
                                    type="number"
                                    fullWidth
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                />
                            </Grid>
                        
                            <Grid item xs={12}>
                                <Typography variant="h6">Add Variations</Typography>
                                {variations.map((variation, index) => (
                                    <TextField
                                        key={index}
                                        label={`Variation ${index + 1}`}
                                        fullWidth
                                        value={variation}
                                        onChange={(e) => handleVariationsChange(index, e.target.value)}
                                        margin="normal"
                                    />
                                ))}
                                <Button onClick={addVariationsField} variant="outlined" sx={{ mt: 2 }}>
                                    Add More Variations
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    accept="image/*"
                                    multiple
                                    type="file"
                                    onChange={createProductImagesChange}
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                />
                                <label htmlFor="raised-button-file">
                                    <Button variant="contained" component="span">
                                        Upload Images
                                    </Button>
                                </label>
                                <div className="flex gap-2 mt-2 w-10 overflow-hidden">
                                    {images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            className="w-10 h-10"
                                        />
                                    ))}
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={createLoading}
                                >
                                    {createLoading ? 'Creating...' : 'Create Product'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>
        </Box>
    )
}

export default AddProduct