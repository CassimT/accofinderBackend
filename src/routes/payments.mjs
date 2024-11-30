import express, { json } from "express";
import { Router } from "express";
import FormData from "form-data";
import axios from "axios";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { Order } from "../dbSchemas/orderSchema.mjs";

const router = Router();

// Airtel pay endpoint
router.post("/api/aitel-access/mobile/pay", checkSchema(paymentValidationSchema), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json(result.array());

    const data = matchedData(req);
    const { amount, phone } = data;

    const registration = "BEDCOM2422"; 
    const token = "69601cefcba70cd7766c49ff280a2448"; 

    const form = new FormData();
    form.append("airtel", "1");
    form.append("token", token);
    form.append("registration", registration);
    form.append("amount", amount);
    form.append("phone", phone);

    const config = {
        method: "post",
        url: "https://api-sandbox.ctechpay.com/student/mobile/", 
        headers: {
            ...form.getHeaders(),
            'Content-Type': 'multipart/form-data',
        },
        data: form,
    };

    try {
        const response = await axios(config);

        // Prepare order data for the database
        const orderData = {
            transactionId: response.data?.data?.transaction?.id || null,
            status: response.data?.data?.transaction?.status || "Unknown",
            amount: amount,
            phone: phone,
            responseCode: response.data?.status?.response_code || "Unknown",
            resultCode: response.data?.status?.result_code || "Unknown",
            message: response.data?.status?.message || "No message",
            createdAt: new Date(),
        };

        // Save the transaction details in the database
        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        // Send the saved order and API response back to the frontend
        res.status(200).json({
            success: true,
            message: "Payment processed successfully",
            transaction: savedOrder,
            apiResponse: response.data, // Include the full API response
        });
    } catch (error) {
        console.error({ msg: "Error:", error });

        res.status(500).json({
            success: false,
            message: "Payment processing failed",
            error: error.message,
        });
    }
});

//SmartCard endpoint
router.post("/api/aitel-access/order", async (req, res) => {
    const registration = "BEDCOM2422"; 
    const token = "69601cefcba70cd7766c49ff280a2448"; 
    const amount = 100;

    const form = new FormData();
    form.append("registration", registration);
    form.append("token", token);
    form.append("amount", amount);

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-sandbox.ctechpay.com/student/?endpoint=order",
        headers: {
            ...form.getHeaders()
        },
        data: form
    };

    try {
        const response = await axios.request(config);
        res.status(200).json({
            success: true,
            message: "Order processed successfully",
            data: response.data
        });

        //extrating Order_Url
        //redirectinion to that Url
    } catch (error) {
        console.error({ msg: error });
        res.status(500).json({
            success: false,
            message: "Order processing failed",
            error: error.message
        });
    }
});

router.post("/api/order", async (req, res) => {
    const registration = "BEDCOM2422";
    const token = "69601cefcba70cd7766c49ff280a2448";
    const amount = 100;

    const form = new FormData();
    form.append("registration", registration);
    form.append("token", token);
    form.append("amount", amount);

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-sandbox.ctechpay.com/student/?endpoint=order",
        headers: {
            ...form.getHeaders()
        },
        data: form
    };

    try {
        const response = await axios.request(config);
        const { order_reference, payment_page_URL } = response.data;

        // Save the order to the database
        const newOrder = new Order({
            order_reference,
            payment_page_URL,
        });

        await newOrder.save();

        // Redirect the user to the payment page
        res.status(200).json({
            success: true,
            message: "Order processed successfully",
            redirectUrl: payment_page_URL, // Frontend can handle the redirection
        });
    } catch (error) {
        console.error("Order processing failed:", error.message);

        res.status(500).json({
            success: false,
            message: "Order processing failed",
            error: error.message
        });
    }
});

//Airtel Money Status End point
router.get("/api/aitel-access/pay/status/:trans_id", async (req, res) => {
    const { trans_id } = req.params;

    const form = new FormData();
    form.append("trans_id", trans_id);

    try {
        // Send request to Ctech Pay API to get the transaction status
        const response = await axios.get(`https://api-sandbox.ctechpay.com/student/mobile/status/?trans_id=${trans_id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Extract status from the response
        const status = response.data.status;
        const transaction = response.data.data.transaction;

        res.status(200).json({
            success: true,
            message: "Payment status retrieved successfully",
            transactionId: transaction.id,
            status: transaction.status,
            details: response.data
        });
    } catch (error) {
        console.error({ msg: error });
        res.status(500).json({
            success: false,
            message: "Failed to retrieve payment status",
            error: error.message
        });
    }
});

//Get order status endpoint
router.get("/api/aitel-access/order/status/:orderReference", async (req, res) => {
    const { orderReference } = req.params;
    const token = "mytoken";
    const registration = "BEDCOM2422";

    // Prepare form data
    const form = new FormData();
    form.append("token", token);
    form.append("registration", registration);
    form.append("orderRef", orderReference);

    try {
        const response = await axios.post(
            "https://api-sandbox.ctechpay.com/student/status/",
            form,
            {
                headers: { ...form.getHeaders() },
            }
        );

        const { status: orderStatus } = response.data;

        // Update the database
        const order = await Order.findOneAndUpdate(
            { order_reference: orderReference },
            { status: orderStatus, updatedAt: new Date() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status retrieved successfully",
            data: {
                orderReference: order.order_reference,
                status: order.status,
            },
        });
    } catch (error) {
        console.error("Failed to retrieve order status:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve order status",
            error: error.message,
        });
    }
});

export default router;
