const cloudinary = require('cloudinary').v2;

const config = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dnvxdg8jp",
        api_key: process.env.CLOUDINARY_API_KEY || "676669881499328",
        api_secret: process.env.CLOUDINARY_API_SECRET || "PXkXEFKlYzPrhSH_5Gcj9WQoArM",
        secure: true,
    });
    return cloudinary;
};

module.exports = { cloudinary, config };
