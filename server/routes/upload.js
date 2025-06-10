const express = require('express');
const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post(
  '/',
  upload.array('images', 10), // up to 10 images
  async (req, res) => {
    const files = req.files;
    const uploadedImages = [];

    try {
      await Promise.all(
        files.map((image) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'images' },
              (err, result) => {
                if (err) return reject(err);
                uploadedImages.push(result.secure_url);
                resolve();
              }
            );
            stream.end(image.buffer);
          });
        })
      );

      return res.status(200).json({ images: uploadedImages });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Image upload failed' });
    }
  }
);

module.exports = router;
