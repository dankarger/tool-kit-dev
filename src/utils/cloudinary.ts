// Require the cloudinary library
export const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});

// Log the configuration
// console.log(cloudinary.config());
