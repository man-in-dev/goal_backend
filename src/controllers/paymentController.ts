import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { logger } from "../utils/logger";
import { PaymentService } from "../services/paymentService";
import { PhiCommerceService } from "../services/phicommerceService";
import { CustomError } from "../middleware/errorHandler";
import EnquiryForm from "../models/EnquiryForm";
import AdmissionEnquiry from "../models/AdmissionEnquiry";
import AdmissionForm from "../models/AdmissionForm";

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

    // Try to find enquiry in AdmissionForm first (for online admission form)
    let enquiry: any = await AdmissionForm.findById(enquiryId);
    let enquiryType = 'AdmissionForm';

    // If not found, try EnquiryForm
    if (!enquiry) {
      enquiry = await EnquiryForm.findById(enquiryId);
      enquiryType = 'EnquiryForm';
    }

    // If not found, try AdmissionEnquiry
    if (!enquiry) {
      enquiry = await AdmissionEnquiry.findById(enquiryId);
      enquiryType = 'AdmissionEnquiry';
    }

    if (!enquiry) {
      logger.error("Enquiry not found", { enquiryId, triedModels: ['AdmissionForm', 'EnquiryForm', 'AdmissionEnquiry'] });
      throw new CustomError("Enquiry not found", 404);
    }

    logger.info("Enquiry found for payment", { enquiryId, enquiryType });

    // Extract enquiry data (handle all models)
    const studentName = enquiry.name;
    const studentEmail = enquiry.email || 'guest@phicommerce.com';
    const studentPhone = enquiry.phone;
    const course = enquiry.course || enquiry.classSeekingAdmission || 'General Admission';

    // Use PhiCommerce for payment initiation
    const paymentResult = await PhiCommerceService.initiatePayment({
      enquiryId,
      amount: parseFloat(amount),
      customerName: studentName,
      customerEmail: studentEmail,
      customerMobile: studentPhone,
      addlParam1: `Enquiry_${enquiryId}`,
      addlParam2: course
    });

    ApiResponse.success(
      res,
      {
        merchantTxnNo: paymentResult.merchantTxnNo,
        amount: parseFloat(amount),
        paymentUrl: paymentResult.redirectUrl,
        tranCtx: paymentResult.tranCtx
      },
      "Payment initiated successfully",
      200
    );
  }
);

// @desc    Handle payment callback from payment gateway
// @route   POST /api/payment/callback
// @route   GET /api/payment/callback
// @access  Public
export const handlePaymentCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.info("Payment callback received", { body: req.body, query: req.query });

    // Payment gateway may send data via POST body or GET query parameters
    const callbackData = Object.keys(req.body).length > 0 ? req.body : req.query;

    try {
      // Handle PhiCommerce callback
      const paymentResult = PhiCommerceService.handlePaymentCallback(callbackData);

      // Extract enquiry ID from addlParam1 (format: "Enquiry_<id>")
      const addlParam1 = callbackData.addlParam1 || '';
      const enquiryIdMatch = addlParam1.match(/Enquiry_(.+)/);
      const enquiryId = enquiryIdMatch ? enquiryIdMatch[1] : null;

      // Update enquiry status if payment is successful and enquiry ID is found
      if (paymentResult.status === 'success' && enquiryId) {
        // Try to update AdmissionForm first
        let updated = await AdmissionForm.findByIdAndUpdate(
          enquiryId,
          { status: 'under_review' },
          { new: true }
        );

        // If not found, try EnquiryForm
        if (!updated) {
          updated = await EnquiryForm.findByIdAndUpdate(
            enquiryId,
            { status: 'contacted' },
            { new: true }
          );
        }

        // If not found, try AdmissionEnquiry
        if (!updated) {
          updated = await AdmissionEnquiry.findByIdAndUpdate(
            enquiryId,
            { status: 'enrolled' },
            { new: true }
          );
        }
      }

      // Redirect to frontend success/failure page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = paymentResult.status === 'success'
        ? `${frontendUrl}/payment/success?transactionId=${paymentResult.merchantTxnNo}`
        : `${frontendUrl}/payment/failure?transactionId=${paymentResult.merchantTxnNo}&error=${encodeURIComponent(paymentResult.respdescription || 'Payment failed')}`;

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

