const Brand = require("../models/Brand") 

class BrandController {
    async index(req, res) {
        try {
            const brandData = await Brand.find().sort({ createdAt: -1 });
            const totalBrand = await Brand.countDocuments()
            res.status(200).json({brand:brandData,totalBrand});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async store(req, res) {
        try {
            await Brand.create({ ...req.body });
            res.status(201).json({ message: 'Brand created successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async show(req, res) {
        try {
            const brandData = await Brand.findById(req.params.id);
            res.status(200).json(brandData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async update(req, res) {
        try {
            await Brand.findByIdAndUpdate(req.params.id, { ...req.body });
            res.status(200).json({ message: 'Brand updated successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req, res) {
        try {
            await Brand.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Brand deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

}

module.exports =  BrandController;