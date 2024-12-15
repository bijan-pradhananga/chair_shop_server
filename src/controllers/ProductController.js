const Product = require('../models/Product'); // Product model
const fs = require('fs');
const path = require('path');

class ProductController  {
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
      const imagePaths = req.files.map(file => file.path); // Collect image file paths
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
      const totalProducts = await Category.countDocuments();
      res.status(200).json(products,totalProducts);
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

      if (req.files && req.files.length > 0) {
        // Handle image replacement if new images are uploaded
        if (req.files.length > 5) {
          return res.status(400).json({ message: 'Maximum 5 images are allowed.' });
        }

        // Delete old images
        product.images.forEach(imagePath => {
          fs.unlinkSync(imagePath);
        });

        // Add new images
        req.body.images = req.files.map(file => file.path);
      }

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
      product.images.forEach(imagePath => {
        fs.unlinkSync(imagePath);
      });

      await product.deleteOne();
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};


module.exports = ProductController;