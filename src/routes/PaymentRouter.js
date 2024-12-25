const express = require('express')
const Payment = require('../controllers/PaymentController');
const pInstance = new Payment()
const paymentRouter = express.Router()

paymentRouter.get('/complete-payment', pInstance.completePayment);

module.exports =  paymentRouter;