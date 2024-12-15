const express = require('express')
const Product = require('../controllers/ProductController');
const productRouter = express.Router();
const pInstance = new Product();

productRouter.get('/', pInstance.index);
productRouter.post('/', pInstance.store);
productRouter.get('/:id', pInstance.show);
productRouter.put('/:id', pInstance.update);
productRouter.delete('/:id', pInstance.destroy);

module.exports =  productRouter;