import crypto from 'crypto';
import Payment, { IPayment } from '../models/Payment';
import { CustomError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import EnvVariables from '../config/envConfig';

interface ICICIEazypayConfig {
  merchantId: string;
  subMerchantId: string;
  encryptionKey: string;
  returnUrl: string;
  paymentUrl: string; // ICICI Eazypay payment URL
}

export class PaymentService {
  private static getConfig(): ICICIEazypayConfig {
    const merchantId = process.env.ICICI_MERCHANT_ID || '359955';
    const subMerchantId = process.env.ICICI_SUB_MERCHANT_ID || '45';
    const encryptionKey = process.env.ICICI_ENCRYPTION_KEY || '3562592999505052';
    const returnUrl = process.env.ICICI_RETURN_URL || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/callback`;
    const paymentUrl = process.env.ICICI_PAYMENT_URL || 'https://eazypay.icicibank.com/EazyPG';

    if (!merchantId || !encryptionKey) {
      throw new CustomError('ICICI Eazypay configuration is missing', 500);
    }

    return {
      merchantId,
      subMerchantId,
      encryptionKey,
      returnUrl,
      paymentUrl
    };
  }

  /**
   * Generate unique transaction ID
   */
  private static generateTransactionId(): string {
    return `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  /**
   * Generate unique order ID
   */
  private static generateOrderId(): string {
    return `ORD${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  /**
   * Encrypt data using ICICI Eazypay encryption method
   */
  private static encryptData(data: string, key: string): string {
    try {
      let keyBuffer: Buffer;
      
      // Try to parse as hex first
      if (/^[0-9a-fA-F]+$/.test(key)) {
        // Key is hex string
        keyBuffer = Buffer.from(key, 'hex');
      } else {
        // Key is raw string or base64, convert to buffer
        keyBuffer = Buffer.from(key, 'utf8');
      }
      
      // AES-256-CBC requires exactly 32 bytes (256 bits) key
      // If key is not 32 bytes, pad or hash it
      if (keyBuffer.length !== 32) {
        if (keyBuffer.length < 32) {
          // Pad with zeros if shorter
          const paddedKey = Buffer.alloc(32);
          keyBuffer.copy(paddedKey);
          keyBuffer = paddedKey;
        } else {
          // Hash if longer (using SHA-256 to get exactly 32 bytes)
          keyBuffer = crypto.createHash('sha256').update(keyBuffer).digest();
        }
      }
      
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
      
      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Prepend IV to encrypted data
      return iv.toString('base64') + ':' + encrypted;
    } catch (error) {
      logger.error('Encryption error:', error);
      logger.error(`Key length: ${key?.length}, Key format check: ${/^[0-9a-fA-F]+$/.test(key || '')}`);
      throw new CustomError(`Failed to encrypt payment data: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  /**
   * Create payment record and generate payment request
   */
  static async initiatePayment(enquiryId: string, paymentData: {
    amount: number;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    course: string;
  }): Promise<{ payment: IPayment; paymentUrl: string; paymentParams: any }> {
    const config = this.getConfig();
    const transactionId = this.generateTransactionId();
    const orderId = this.generateOrderId();

    // Create payment record
    const payment = await Payment.create({
      enquiryId,
      transactionId,
      orderId,
      amount: paymentData.amount,
      currency: 'INR',
      status: 'pending',
      paymentGateway: 'icici_eazypay',
      studentName: paymentData.studentName,
      studentEmail: paymentData.studentEmail,
      studentPhone: paymentData.studentPhone,
      course: paymentData.course,
      returnUrl: config.returnUrl
    });

    // ICICI Eazypay uses GET request with encrypted query parameters
    // Format: mandatory fields, optional fields, returnurl, Reference No, submerchantid, transaction amount, paymode
    
    // Prepare mandatory fields (encrypted)
    const mandatoryFields = {
      OrderId: orderId,
      Amount: paymentData.amount.toFixed(2),
      Currency: 'INR',
      TxnType: 'SALE',
      CustomerName: paymentData.studentName,
      CustomerEmail: paymentData.studentEmail,
      CustomerMobile: paymentData.studentPhone,
      Description: `Admission Fee - ${paymentData.course}`
    };
    
    const mandatoryFieldsString = Object.entries(mandatoryFields)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    // Optional fields (can be empty)
    const optionalFields = '';
    
    // Encrypt each field separately
    const encryptedMandatoryFields = this.encryptData(mandatoryFieldsString, config.encryptionKey);
    const encryptedReturnUrl = this.encryptData(config.returnUrl, config.encryptionKey);
    const encryptedReferenceNo = this.encryptData(orderId, config.encryptionKey);
    const encryptedSubMerchantId = config.subMerchantId ? this.encryptData(config.subMerchantId, config.encryptionKey) : '';
    const encryptedAmount = this.encryptData(paymentData.amount.toFixed(2), config.encryptionKey);
    const encryptedPayMode = this.encryptData('ALL', config.encryptionKey); // ALL means all payment modes
    
    // Validate all encrypted values
    if (!encryptedMandatoryFields || !encryptedReturnUrl || !encryptedReferenceNo || !encryptedAmount || !encryptedPayMode) {
      logger.error('Encryption failed for one or more fields', {
        hasMandatoryFields: !!encryptedMandatoryFields,
        hasReturnUrl: !!encryptedReturnUrl,
        hasReferenceNo: !!encryptedReferenceNo,
        hasAmount: !!encryptedAmount,
        hasPayMode: !!encryptedPayMode
      });
      throw new CustomError('Failed to encrypt payment data', 500);
    }
    
    // URL encode the encrypted values
    const urlEncodedMandatoryFields = encodeURIComponent(encryptedMandatoryFields);
    const urlEncodedReturnUrl = encodeURIComponent(encryptedReturnUrl);
    const urlEncodedReferenceNo = encodeURIComponent(encryptedReferenceNo);
    const urlEncodedSubMerchantId = encryptedSubMerchantId ? encodeURIComponent(encryptedSubMerchantId) : '';
    const urlEncodedAmount = encodeURIComponent(encryptedAmount);
    const urlEncodedPayMode = encodeURIComponent(encryptedPayMode);
    
    // Build the payment URL with query parameters
    // Note: submerchantid should only be included if it's not empty
    let paymentUrl = `${config.paymentUrl}?merchantid=${config.merchantId}&mandatory%20fields=${urlEncodedMandatoryFields}&optional%20fields=${encodeURIComponent(optionalFields)}&returnurl=${urlEncodedReturnUrl}&Reference%20No=${urlEncodedReferenceNo}`;
    
    // Add submerchantid only if it exists
    if (urlEncodedSubMerchantId) {
      paymentUrl += `&submerchantid=${urlEncodedSubMerchantId}`;
    }
    
    paymentUrl += `&transaction%20amount=${urlEncodedAmount}&paymode=${urlEncodedPayMode}`;

    // Validate payment URL
    if (!paymentUrl || !config.paymentUrl) {
      logger.error('Invalid payment URL configuration', {
        paymentUrl: config.paymentUrl,
        constructedUrl: paymentUrl
      });
      throw new CustomError('Failed to construct payment URL', 500);
    }

    logger.info('Payment initiated', {
      paymentId: payment._id,
      transactionId,
      orderId,
      amount: paymentData.amount,
      paymentUrlBase: config.paymentUrl,
      paymentUrlLength: paymentUrl.length,
      merchantId: config.merchantId,
      hasSubMerchantId: !!urlEncodedSubMerchantId
    });

    // Log first part of URL for debugging (without sensitive data)
    logger.info('Payment URL preview:', paymentUrl.substring(0, 150) + '...');

    return {
      payment,
      paymentUrl: paymentUrl,
      paymentParams: {
        merchantId: config.merchantId,
        encryptedMandatoryFields: encryptedMandatoryFields,
        encryptedReturnUrl: encryptedReturnUrl,
        encryptedReferenceNo: encryptedReferenceNo,
        encryptedSubMerchantId: encryptedSubMerchantId,
        encryptedAmount: encryptedAmount,
        encryptedPayMode: encryptedPayMode
      }
    };
  }

  /**
   * Handle payment callback from ICICI Eazypay
   */
  static async handlePaymentCallback(callbackData: any): Promise<IPayment> {
    const { OrderId, TransactionId, Status, ResponseCode, ResponseMessage, Amount } = callbackData;

    if (!OrderId) {
      throw new CustomError('Order ID is required', 400);
    }

    // Find payment by order ID
    const payment = await Payment.findOne({ orderId: OrderId });

    if (!payment) {
      throw new CustomError('Payment not found', 404);
    }

    // Update payment status based on response
    if (Status === 'SUCCESS' || ResponseCode === '000') {
      payment.status = 'success';
      payment.gatewayTransactionId = TransactionId || callbackData.GatewayTransactionId;
      payment.paymentMethod = callbackData.PaymentMethod || 'Card';
      payment.gatewayResponse = callbackData;
    } else {
      payment.status = 'failed';
      payment.failureReason = ResponseMessage || 'Payment failed';
      payment.gatewayResponse = callbackData;
    }

    await payment.save();

    logger.info('Payment callback processed', {
      paymentId: payment._id,
      orderId: OrderId,
      status: payment.status
    });

    return payment;
  }

  /**
   * Get payment by transaction ID
   */
  static async getPaymentByTransactionId(transactionId: string): Promise<IPayment> {
    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      throw new CustomError('Payment not found', 404);
    }

    return payment;
  }

  /**
   * Get payment by order ID
   */
  static async getPaymentByOrderId(orderId: string): Promise<IPayment> {
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      throw new CustomError('Payment not found', 404);
    }

    return payment;
  }

  /**
   * Get payment by enquiry ID
   */
  static async getPaymentByEnquiryId(enquiryId: string): Promise<IPayment | null> {
    return await Payment.findOne({ enquiryId }).sort({ createdAt: -1 });
  }
}

