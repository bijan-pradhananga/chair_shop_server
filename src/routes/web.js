const express = require('express');
const brandRouter = require('./BrandRouter');
const categoryRouter = require('./CategoryRouter');
const router = express.Router();

router.use('/brand',brandRouter);
router.use('/category',categoryRouter);
// router.use('/order',orderRouter)
// router.use('/brand',brandRouter)
// router.use('/product',productRouter)
// router.use('/cart',cartRouter)

module.exports = router