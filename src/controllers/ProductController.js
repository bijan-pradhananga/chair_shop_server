const Product = require('../models/Product'); // Product model
const fs = require('fs');
const path = require('path');

class ProductController {
  // Create a product
  async store(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'At least one image is required.' });
      }
      // Limit to 5 images
      if (req.files.length > 5) {
        return res.status(400).json({ message: 'Maximum 5 images are allowed.' });
      }
      const imagePaths = req.files.map(file => file.path.replace('public\\', '').replace('public/', ''));
      const product = await Product.create({
        ...req.body,
        images: imagePaths
      });
      res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get all products
  async index(req, res) {
    try {
      const products = await Product.find().populate('category brand');
      const total = await Product.countDocuments();
      res.status(200).json({ products, total });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get single product
  async show(req, res) {
    try {
      const product = await Product.findById(req.params.id).populate('category brand');
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Update a product
  async update(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
     
      
      // Handle new image uploads
      if (req.files && req.files.length > 0) {
       
        
        // Combine existing and new images
        const newImages = req.files.map(file => file.path.replace('public\\', '').replace('public/', ''));
        const combinedImages = [...product.images, ...newImages];

        // Validate the total number of images
        if (combinedImages.length > 5) {
          // Remove uploaded files since they won't be saved
          req.files.forEach(file => {
            const fullPath = path.join(__dirname, '..', '..', 'public', file.path);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          });

          return res.status(400).json({ message: 'A maximum of 5 images are allowed per product.' });
        }

        // Update the product's images
        product.images = combinedImages;
      }

      // Update other fields
      Object.assign(product, req.body);
      await product.save();

      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


  // Delete a product
  async destroy(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Delete product images
      // Correct path construction
      product.images.forEach(imagePath => {
        const fullImagePath = path.join(__dirname, '..', '..', 'public', imagePath);  // Adjust path to point to public folder
        fs.unlinkSync(fullImagePath);  // Delete image file
      });

      await product.deleteOne();
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Delete a single image from a product
  async deleteImage(req, res) {
    try {
      const { id, imageName } = req.params;

      // Find the product by ID
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Ensure the product has more than one image
      if (product.images.length <= 1) {
        return res.status(400).json({
          message: 'Cannot delete the last remaining image of the product.',
        });
      }

      // Check if the image exists in the product's images array
      const imagePath = `products\\${imageName}`; // Update based on your storage structure
      const imageIndex = product.images.findIndex(img => img === imagePath);
      if (imageIndex === -1) {
        return res.status(404).json({ message: 'Image not found in the product.' });
      }

      // Remove the image from the images array
      product.images.splice(imageIndex, 1);

      // Delete the image file from the public folder
      const fullImagePath = path.join(__dirname, '..', '..', 'public', imagePath); // Adjust to match your `public` folder structure
      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath);
      }

      // Save the product with the updated images array
      await product.save();

      res.status(200).json({ message: 'Image deleted successfully', product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async search(req, res) {
    try {
        // Get the search query from the request's query parameters
        const searchQuery = req.query.q || ''; 

        // Search products using regex to match product names (case insensitive)
        const products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' }
        })
        .populate('category') // Populate the category field
        .populate('brand')    // Populate the brand field
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .limit(5); // Limit the result to 5

        const total = await Product.countDocuments({
            name: { $regex: searchQuery, $options: 'i' }
        });

        res.status(200).json({ products, total });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


};


module.exports = ProductController;