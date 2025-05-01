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
import { validateImageFile, getFileValidationErrorMessage, validateBase64Image } from '../utils/imageValidation';

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
    const [imagesModified, setImagesModified] = useState(false);
    const [variations, setVariations] = useState([{ name: "", price: 0, image: null }]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const imagesUploadChange = (e) => {
        const files = Array.from(e.target.files);
        setImagesModified(true); // Mark images as modified

        const newImages = [];

        files.forEach((file) => {
            // Use the validation utility
            const validation = validateImageFile(file);
            if (!validation.valid) {
                toast.error(getFileValidationErrorMessage(file, validation));
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    // Double-check the base64 size as well
                    const base64Result = reader.result;
                    const base64Validation = validateBase64Image(base64Result);
                    
                    if (!base64Validation.valid) {
                        toast.error(`File "${file.name}": ${base64Validation.error}`);
                        return;
                    }
                    
                    newImages.push(base64Result);
                    setImages(newImages);
                }
            };

            reader.readAsDataURL(file);
        });
    }

    const handleVariationImageChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Use the validation utility
        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast.error(getFileValidationErrorMessage(file, validation));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                // Double-check the base64 size as well
                const base64Result = reader.result;
                const base64Validation = validateBase64Image(base64Result);
                
                if (!base64Validation.valid) {
                    toast.error(`File "${file.name}": ${base64Validation.error}`);
                    return;
                }
                
                const updatedVariations = [...variations];
                updatedVariations[index] = {
                    ...updatedVariations[index],
                    image: base64Result, // Store base64 string
                    imageModified: true // Mark this variation image as modified
                };
                setVariations(updatedVariations);
            }
        };
        reader.readAsDataURL(file);
    };

    const updateProjectSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate required fields
            if (!name.trim()) {
                toast.error("Product name is required");
                return;
            }

            if (!description.trim()) {
                toast.error("Product description is required");
                return;
            }

            if (!category) {
                toast.error("Please select a category");
                return;
            }

            if (price <= 0) {
                toast.error("Price must be greater than 0");
                return;
            }

            if (stock < 0) {
                toast.error("Stock cannot be negative");
                return;
            }

            if (images.length === 0) {
                toast.error("Please upload at least one product image");
                return;
            }

            // Validate and clean variations
            const validVariations = variations.filter(v => {
                // Handle different variation formats
                if (typeof v === 'string') {
                    return v.trim() !== "";
                } else if (v.name) {
                    // Check if name is a stringified JSON
                    if (v.name.startsWith('{') && v.name.includes('"name":"')) {
                        try {
                            const parsed = JSON.parse(v.name);
                            return parsed.name && parsed.name.trim() !== "";
                        } catch (e) {
                            return v.name.trim() !== "";
                        }
                    }
                    return v.name.trim() !== "";
                }
                return false;
            }).map(v => {
                // Normalize variation format
                if (typeof v === 'string') {
                    return { name: v, price: 0, image: null };
                } else if (v.name && v.name.startsWith('{') && v.name.includes('"name":"')) {
                    try {
                        const parsed = JSON.parse(v.name);
                        return {
                            name: parsed.name || "",
                            price: parsed.price || v.price || 0,
                            image: v.image || null
                        };
                    } catch (e) {
                        return v;
                    }
                }
                
                // Process variation image
                let imageData = v.image;
                // If image wasn't modified and is an object with url, keep it
                if (!v.imageModified && imageData && typeof imageData === 'object' && imageData.url) {
                    // Keep the existing image object
                } 
                
                return {
                    ...v,
                    image: imageData
                };
            });
            
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

            // Only append images if they were modified, otherwise send the existing ones
            if (imagesModified) {
                // User uploaded new images, send the new base64 data
                images.forEach((image) => {
                    data.append("images", image);
                });
            } else {
                // User didn't change images, send the existing ones as is
                data.set("images", JSON.stringify(images));
            }

            // Show loading toast
            const loadingToastId = toast.loading("Updating product, please wait...");
            
            try {
                const result = await dispatch(updateProduct({ id: params.id, data }));
                
                // Clear loading toast
                toast.dismiss(loadingToastId);

                if (updateProduct.fulfilled.match(result)) {
                    toast.success(result.payload.message || "Product updated successfully!");
                    navigate("/admin/products");
                } else if (updateProduct.rejected.match(result)) {
                    const errorMessage = result.payload || "Failed to update product!";
                    toast.error(errorMessage);
                }
            } catch (error) {
                // Clear loading toast
                toast.dismiss(loadingToastId);
                
                const errorMessage = error.response?.data?.message || "An error occurred while updating the product";
                toast.error(errorMessage);
                console.error("Error in form submission:", error);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while updating the product";
            toast.error(errorMessage);
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
            setImagesModified(false); // Reset modified flag when loading product
            
            // Handle different variation formats
            if (product.variations && product.variations.length > 0) {
                // Check if variations are in old format (strings) or partially converted format
                const processedVariations = product.variations.map(variation => {
                    // Case 1: String format (completely old)
                    if (typeof variation === 'string') {
                        return {
                            name: variation,
                            price: 0,
                            image: null,
                            imageModified: false // Add flag to track if image was modified
                        };
                    }
                    // Case 2: Object format but with stringified JSON in name (partially converted)
                    else if (variation.name && variation.name.startsWith('{') && variation.name.includes('"name":"')) {
                        try {
                            const parsedVariation = JSON.parse(variation.name);
                            return {
                                name: parsedVariation.name || "",
                                price: parsedVariation.price || variation.price || 0,
                                image: variation.image || null,
                                imageModified: false // Add flag to track if image was modified
                            };
                        } catch (e) {
                            // If parsing fails, use as is
                            return {
                                name: variation.name,
                                price: variation.price || 0,
                                image: variation.image || null,
                                imageModified: false // Add flag to track if image was modified
                            };
                        }
                    }
                    // Case 3: Already in new format
                    else {
                        return {
                            name: variation.name || "",
                            price: variation.price || 0,
                            image: variation.image || null,
                            imageModified: false // Add flag to track if image was modified
                        };
                    }
                });
                
                setVariations(processedVariations);
            } else {
                setVariations([{ name: "", price: 0, image: null, imageModified: false }]);
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
        setVariations([...variations, { name: "", price: 0, image: null }]);
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
                                                        label="Variation Price"
                                                        type="number"
                                                        fullWidth
                                                        value={variation.price}
                                                        onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                                                        margin="normal"
                                                        InputProps={{
                                                            startAdornment: <span>PKR</span>,
                                                        }}
                                                        required
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
                                                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 0.5 }}>
                                                        * Image less than 500KB. JPG, JPEG, PNG, WEBP only. Square images (1:1) recommended for best display.
                                                    </Typography>
                                                    {(variation.image?.url || variation.image) && (
                                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                            <img
                                                                src={typeof variation.image === 'string' ? variation.image : variation.image?.url}
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
                                <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                                    * Upload images less than 500KB in size. Allowed formats: JPG, JPEG, PNG, WEBP. Square images (1:1) recommended for best display.
                                </Typography>
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
