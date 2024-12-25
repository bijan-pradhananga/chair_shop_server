const { getEsewaPaymentHash, verifyEsewaPayment } = require("../helper/esewa");
const Order = require('../models/Order');
const Payment = require('../models/Payment');

class PaymentController{
        //for checkout
        async initializePayment(order,res) {
            try {
                // Initiate payment with eSewa
                const payment = await getEsewaPaymentHash({
                    amount: order.totalAmount,
                    transaction_uuid: order._id,
                });

                // Respond with payment details
                res.status(201).json({
                    message: 'Order created successfully',
                    success: true,
                    payment,
                    order: order,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                });
            }
        }
    
        async completePayment(req, res) {
            const { data } = req.query; // Data received from eSewa's redirect
    
            try {
                // Verify payment with eSewa
                const paymentInfo = await verifyEsewaPayment(data);
                
                // Find the purchased item using the transaction UUID
                const order = await Order.findById(
                    paymentInfo.response.transaction_uuid
                );
    
                if (!order) {
                    return res.status(500).json({
                        success: false,
                        message: "Purchase not found",
                    });
                }
               
                
                // Create a new payment record in the database
                const paymentData = await Payment.create({
                    pidx: paymentInfo.decodedData.transaction_code,
                    transactionId: paymentInfo.decodedData.transaction_code,
                    orderId: paymentInfo.response.transaction_uuid,
                    amount: order.totalAmount,
                    dataFromVerificationReq: paymentInfo,
                    apiQueryFromUser: req.query,
                    paymentGateway: "esewa",
                    status: "success",
                });
                
                // Update the purchased item payment status to 'paid'
                await Order.findByIdAndUpdate(
                    paymentInfo.response.transaction_uuid,
                    { $set: { paymentStatus: "Paid" } }
                );

                // Respond with success message
                return res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`)
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "An error occurred during payment verification",
                    error: error.message,
                });
            }
        }
} 
module.exports = PaymentController