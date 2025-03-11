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
    const [variations, setVariations] = useState([{ name: "", color: "", image: null }])
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

    const handleVariationImageChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                const updatedVariations = [...variations];
                updatedVariations[index] = {
                    ...updatedVariations[index],
                    image: reader.result // Store base64 string
                };
                setVariations(updatedVariations);
            }
        };
        reader.readAsDataURL(file);
    };

    const addProjectSubmit = async (e) => {
        e.preventDefault();

        // Validate variations
        const validVariations = variations.filter(v => v.name.trim() !== "");
        if (validVariations.length === 0) {
            toast.error("Please add at least one variation");
            return;
        }

        const data = new FormData();
        data.set("name", name);
        data.set("description", description);
        data.set("category", category);
        data.set("subCategory", subCategory);
        data.set("price", price);
        data.set("stock", stock);
        
        // Convert variations to JSON string to preserve structure
        data.set("variations", JSON.stringify(validVariations));

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
            setVariations([{ name: "", color: "", image: null }]);
            navigate("/admin/products");
        } else {
            toast.error("Error Creating product");
        }
    };

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    const handleVariationChange = (index, field, value) => {
        const updatedVariations = [...variations];
        updatedVariations[index] = {
            ...updatedVariations[index],
            [field]: value
        };
        setVariations(updatedVariations);
    };

    const addVariationsField = () => {
        setVariations([...variations, { name: "", color: "", image: null }]);
    };

    const removeVariation = (index) => {
        if (variations.length > 1) {
            const updatedVariations = [...variations];
            updatedVariations.splice(index, 1);
            setVariations(updatedVariations);
        }
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
                                <Typography variant="h6" gutterBottom>Add Variations</Typography>
                                {variations.map((variation, index) => (
                                    <Box key={index} sx={{ border: '1px solid #e0e0e0', p: 2, mb: 2, borderRadius: 1 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Variation Name"
                                                    fullWidth
                                                    value={variation.name}
                                                    onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                                                    margin="normal"
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Color Code (optional)"
                                                    fullWidth
                                                    value={variation.color}
                                                    onChange={(e) => handleVariationChange(index, 'color', e.target.value)}
                                                    margin="normal"
                                                    placeholder="#RRGGBB"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <input
                                                    accept="image/*"
                                                    type="file"
                                                    onChange={(e) => handleVariationImageChange(index, e)}
                                                    style={{ display: 'none' }}
                                                    id={`variation-image-${index}`}
                                                />
                                                <label htmlFor={`variation-image-${index}`}>
                                                    <Button variant="outlined" component="span" sx={{ mt: 1 }}>
                                                        Upload Variation Image
                                                    </Button>
                                                </label>
                                                {variation.image && (
                                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                        <img
                                                            src={variation.image}
                                                            alt={`Variation ${index + 1}`}
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                                        />
                                                        <Typography variant="caption">Image uploaded</Typography>
                                                    </Box>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    onClick={() => removeVariation(index)} 
                                                    variant="outlined" 
                                                    color="error"
                                                    disabled={variations.length <= 1}
                                                >
                                                    Remove
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <Button onClick={addVariationsField} variant="outlined" sx={{ mt: 2 }}>
                                    Add More Variations
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Product Images</Typography>
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
                                        Upload Product Images
                                    </Button>
                                </label>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                    {images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                    ))}
                                </Box>
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