const Category = require("../models/Category");
const Product = require("../models/Product");

class CategoryController {
    async index(req, res) {
        try {
            const catData = await Category.find().sort({ createdAt: -1 });
            const total = await Category.countDocuments();
            res.status(200).json({ category: catData, total });
        } catch (err) {
            console.error('Error fetching categories:', err.message);
            res.status(500).json({ message: 'Failed to fetch categories' });
        }
    }

    async store(req, res) {
        try {
            const category = await Category.create({ ...req.body });
            res.status(201).json({ message: 'Category created successfully', data: category });
        } catch (err) {
            if (err.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation error', errors: err.errors });
            }
            console.error('Error creating category:', err.message);
            res.status(500).json({ message: 'Failed to create category' });
        }
    }

    async show(req, res) {
        try {
            const catData = await Category.findById(req.params.id);
            if (!catData) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(catData);
        } catch (err) {
            console.error('Error fetching category:', err.message);
            res.status(500).json({ message: 'Failed to fetch category' });
        }
    }

    async update(req, res) {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
        } catch (err) {
            console.error('Error updating category:', err.message);
            res.status(500).json({ message: 'Failed to update category' });
        }
    }

    async destroy(req, res) {
        try {
            // Check if the category is being used by any products
            const productsUsingCategory = await Product.findOne({ category: req.params.id });
            
            if (productsUsingCategory) {
                return res.status(400).json({ message: 'Category cannot be deleted as it is associated with products' });
            }
            const deletedCategory = await Category.findByIdAndDelete(req.params.id);
            if (!deletedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (err) {
            console.error('Error deleting category:', err.message);
            res.status(500).json({ message: 'Failed to delete category' });
        }
    }

    async search(req, res) {
        try {
            // Get the search query from the request's query parameters
            const searchQuery = req.query.q || ''; 

            // Search categories using regex to match category names (case insensitive)
            const category = await Category.find({
                name: { $regex: searchQuery, $options: 'i' }
            }).sort({ createdAt: -1 });

            const total = await Category.countDocuments({
                name: { $regex: searchQuery, $options: 'i' }
            });

            res.status(200).json({ category, total });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = CategoryController;
