// Require the cloudinary library

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// export const cloudinary = require("cloudinary").v2;

// // Return "https" URLs by setting secure: true
// cloudinary.config({
//   secure: true,
// });
