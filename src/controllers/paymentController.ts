import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { logger } from "../utils/logger";
import { PaymentService } from "../services/paymentService";
import { CustomError } from "../middleware/errorHandler";
import EnquiryForm from "../models/EnquiryForm";
import AdmissionEnquiry from "../models/AdmissionEnquiry";

// @desc    Initiate payment for admission form
// @route   POST /api/payment/initiate
// @access  Public
export const initiatePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { enquiryId, amount } = req.body;

    if (!enquiryId || !amount) {
      throw new CustomError("Enquiry ID and amount are required", 400);
    }

    if (amount <= 0) {
      throw new CustomError("Amount must be greater than 0", 400);
    }

    // Try to find enquiry in EnquiryForm first (most common)
    let enquiry = await EnquiryForm.findById(enquiryId);
    let enquiryType = 'EnquiryForm';

    // If not found, try AdmissionEnquiry
    if (!enquiry) {
      enquiry = await AdmissionEnquiry.findById(enquiryId);
      enquiryType = 'AdmissionEnquiry';
    }

    if (!enquiry) {
      logger.error("Enquiry not found", { enquiryId, triedModels: ['EnquiryForm', 'AdmissionEnquiry'] });
      throw new CustomError("Enquiry not found", 404);
    }

    logger.info("Enquiry found for payment", { enquiryId, enquiryType });

    // Check if payment already exists for this enquiry
    const existingPayment = await PaymentService.getPaymentByEnquiryId(enquiryId);
    if (existingPayment && existingPayment.status === 'success') {
      throw new CustomError("Payment already completed for this enquiry", 400);
    }

    // Extract enquiry data (handle both models)
    const studentName = enquiry.name;
    const studentEmail = enquiry.email || '';
    const studentPhone = enquiry.phone;
    const course = enquiry.course || 'General Admission';

    // Initiate payment
    const paymentData = await PaymentService.initiatePayment(enquiryId, {
      amount: parseFloat(amount),
      studentName,
      studentEmail,
      studentPhone,
      course
    });

    ApiResponse.success(
      res,
      {
        paymentId: paymentData.payment._id,
        transactionId: paymentData.payment.transactionId,
        orderId: paymentData.payment.orderId,
        amount: paymentData.payment.amount,
        paymentUrl: paymentData.paymentUrl,
        paymentParams: paymentData.paymentParams
      },
      "Payment initiated successfully",
      200
    );
  }
);

// @desc    Handle payment callback from ICICI Eazypay
// @route   POST /api/payment/callback
// @route   GET /api/payment/callback
// @access  Public
export const handlePaymentCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.info("Payment callback received", { body: req.body, query: req.query });

    // ICICI Eazypay may send data via POST body or GET query parameters
    const callbackData = Object.keys(req.body).length > 0 ? req.body : req.query;

    try {
      const payment = await PaymentService.handlePaymentCallback(callbackData);

      // Update enquiry status if payment is successful
      if (payment.status === 'success') {
        // Try to update EnquiryForm first
        let updated = await EnquiryForm.findByIdAndUpdate(
          payment.enquiryId,
          { status: 'contacted' },
          { new: true }
        );

        // If not found, try AdmissionEnquiry
        if (!updated) {
          updated = await AdmissionEnquiry.findByIdAndUpdate(
            payment.enquiryId,
            { status: 'enrolled' },
            { new: true }
          );
        }
      }

      // Redirect to frontend success/failure page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = payment.status === 'success'
        ? `${frontendUrl}/payment/success?transactionId=${payment.transactionId}`
        : `${frontendUrl}/payment/failure?transactionId=${payment.transactionId}`;

      res.redirect(redirectUrl);
    } catch (error) {
      logger.error("Payment callback error:", error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/payment/failure?error=callback_error`);
    }
  }
);

// @desc    Get payment status
// @route   GET /api/payment/status/:transactionId
// @access  Public
export const getPaymentStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { transactionId } = req.params;

    const payment = await PaymentService.getPaymentByTransactionId(transactionId);

    ApiResponse.success(
      res,
      {
        transactionId: payment.transactionId,
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status,
        gatewayTransactionId: payment.gatewayTransactionId,
        failureReason: payment.failureReason,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt
      },
      "Payment status retrieved successfully",
      200
    );
  }
);

// @desc    Get payment by enquiry ID
// @route   GET /api/payment/enquiry/:enquiryId
// @access  Public
export const getPaymentByEnquiry = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { enquiryId } = req.params;

    const payment = await PaymentService.getPaymentByEnquiryId(enquiryId);

    if (!payment) {
      throw new CustomError("No payment found for this enquiry", 404);
    }

    ApiResponse.success(
      res,
      {
        transactionId: payment.transactionId,
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status,
        gatewayTransactionId: payment.gatewayTransactionId,
        failureReason: payment.failureReason,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt
      },
      "Payment retrieved successfully",
      200
    );
  }
);

