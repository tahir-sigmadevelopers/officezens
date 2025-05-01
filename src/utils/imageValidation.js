/**
 * Utility functions for image validation
 */

/**
 * Validates an image file against size and type constraints
 * @param {File} file - The image file to validate
 * @param {number} maxSizeKB - Maximum size in KB (default: 500)
 * @returns {Object} - { valid: boolean, error: string or null }
 */
export const validateImageFile = (file, maxSizeKB = 500) => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Check file type
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type: ${file.type}. Only JPG, JPEG, PNG, or WEBP allowed.` 
    };
  }
  
  // Check file size
  const sizeInKB = file.size / 1024;
  if (sizeInKB > maxSizeKB) {
    return { 
      valid: false, 
      error: `File size (${Math.round(sizeInKB)}KB) exceeds the ${maxSizeKB}KB limit` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validates a base64 image string against size constraints
 * @param {string} base64String - The base64 image string to validate
 * @param {number} maxSizeKB - Maximum size in KB (default: 500)
 * @returns {Object} - { valid: boolean, error: string or null }
 */
export const validateBase64Image = (base64String, maxSizeKB = 500) => {
  // Check if string exists and is a base64 image
  if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:image')) {
    return { 
      valid: false, 
      error: 'Invalid image format. Image must be in base64 format.' 
    };
  }
  
  // Calculate approximate size of base64 string
  // Formula: (base64 length * 3) / 4 gives approximate byte size
  const base64Size = Math.round((base64String.length * 3) / 4);
  const sizeInKB = base64Size / 1024;
  
  if (sizeInKB > maxSizeKB) {
    return { 
      valid: false, 
      error: `Image size (${Math.round(sizeInKB)}KB) exceeds the ${maxSizeKB}KB limit` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Gets the extension from a base64 image string
 * @param {string} base64String - The base64 image string
 * @returns {string} - The image extension (e.g., 'jpeg', 'png')
 */
export const getBase64Extension = (base64String) => {
  const match = base64String.match(/data:image\/([a-zA-Z0-9]+);base64/);
  return match ? match[1] : '';
};

/**
 * Helper utility to generate user-friendly error message for file upload validation
 * @param {File} file - The file that failed validation
 * @param {Object} validationResult - Result from validateImageFile
 * @returns {string} - User-friendly error message
 */
export const getFileValidationErrorMessage = (file, validationResult) => {
  if (!validationResult.valid) {
    return `File "${file.name}": ${validationResult.error}`;
  }
  return null;
}; 