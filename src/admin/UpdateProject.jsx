import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { fetchAllCategories, updateProduct } from '../redux/reducers/products'
import { Skeleton } from '../components/Loader'
import { fetchProductDetails } from '../redux/reducers/product-details'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UpdateProduct = () => {

    const { updateError, message, updateLoading, allCategories } = useSelector(state => state.products);
    const { product, loading: productLoading } = useSelector((state) => state.productDetails);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("")
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [variations, setVariations] = useState([{ name: "", color: "", image: null }]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const imagesUploadChange = (e) => {
        const files = Array.from(e.target.files);

        const newImages = [];

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    newImages.push(reader.result);
                    setImages(newImages);
                }
            };

            reader.readAsDataURL(file);
        });
    }

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

    const updateProjectSubmit = async (e) => {
        e.preventDefault();

        // Validate variations
        const validVariations = variations.filter(v => 
            typeof v === 'string' ? v.trim() !== "" : v.name.trim() !== ""
        );
        
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

        const resultAction = dispatch(updateProduct({ id: params.id, data }));

        toast.success("Product updated successfully!");
        if (updateProduct.fulfilled.match(resultAction)) {
            navigate("/admin/products");
        } else if (updateProduct.rejected.match(resultAction)) {
            const error = resultAction.payload || "Failed to update product!";
            toast.error(error);
            console.log("Error during product update:", error);
            console.log("Full action details:", resultAction);
        }
    };

    useEffect(() => {
        if (updateError) {
            toast.error(updateError);
        }
    }, [updateError]);

    useEffect(() => {
        dispatch(fetchProductDetails(params.id));
    }, [dispatch, params.id]);

    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setCategory(product.category || "");
            setSubCategory(product.subCategory || "");
            setPrice(product.price || 0);
            setStock(product.stock || 0);
            setImages(product.images || []);
            
            // Handle different variation formats
            if (product.variations && product.variations.length > 0) {
                // Check if variations are in old format (strings)
                if (typeof product.variations[0] === 'string') {
                    // Convert old format to new format
                    const newVariations = product.variations.map(variation => ({
                        name: variation,
                        color: "",
                        image: null
                    }));
                    setVariations(newVariations);
                } else {
                    // Use new format
                    setVariations(product.variations);
                }
            } else {
                setVariations([{ name: "", color: "", image: null }]);
            }
        }
    }, [product]);

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, []);

    // Get the subcategories for the selected category
    const selectedCategory = allCategories.find(cat => cat?.category === category);
    const subCategories = selectedCategory ? selectedCategory?.subCategory : [];

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

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="md">
                    <Typography variant="h4" gutterBottom>
                        Update Product
                    </Typography>
                    {productLoading ? (
                        <Skeleton />
                    ) : (
                        <form onSubmit={updateProjectSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={setDescription}
                                        style={{ height: '200px', paddingBottom: '25px', width: '100%' }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        label="Category"
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
                                        label="Sub Category"
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
                                        onChange={(e) => setPrice(e.target.value)}
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
                                    <Typography variant="h6" gutterBottom>Product Variations</Typography>
                                    {variations?.map((variation, index) => (
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
                                                            {variation.image?.url ? 'Change Variation Image' : 'Upload Variation Image'}
                                                        </Button>
                                                    </label>
                                                    {(variation.image?.url || variation.image) && (
                                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                            <img
                                                                src={variation.image?.url || variation.image}
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
                                        onChange={imagesUploadChange}
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="contained" component="span">
                                            Upload Product Images
                                        </Button>
                                    </label>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                        {images?.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image?.url || image}
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
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? 'Updating...' : 'Update Product'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default UpdateProduct;
