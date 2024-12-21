const express = require('express');
const brandRouter = require('./BrandRouter');
const cartRouter = require('./CartRouter');
const categoryRouter = require('./CategoryRouter');
const productRouter = require('./ProductRouter');
const router = express.Router();

// Other routes
router.use('/brand', brandRouter);
router.use('/category', categoryRouter);
router.use('/cart', cartRouter);
// router.use('/order', orderRouter);
router.use('/product', productRouter);


module.exports = router;
