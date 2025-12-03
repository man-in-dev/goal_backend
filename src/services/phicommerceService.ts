import crypto from 'crypto';
import axios from 'axios';
import { CustomError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

interface PhiCommerceConfig {
  merchantId: string;
  merchantSecretKey: string;
  initiateSaleUrl: string;
  returnUrl: string;
  currencyCode: string;
}

export class PhiCommerceService {
  private static getConfig(): PhiCommerceConfig {
    const merchantId = process.env.PHICOMMERCE_MERCHANT_ID || '359955';
    const merchantSecretKey = process.env.PHICOMMERCE_SECRET_KEY || '3562592999505052';
    const initiateSaleUrl = process.env.PHICOMMERCE_INITIATE_SALE_URL || 'https://qa.phicommerce.com/pg/api/v2/initiateSale';
    const returnUrl = process.env.PHICOMMERCE_RETURN_URL || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/callback`;
    const currencyCode = process.env.PHICOMMERCE_CURRENCY_CODE || '356'; // 356 = INR

    if (!merchantId || !merchantSecretKey) {
      throw new CustomError('PhiCommerce configuration is missing', 500);
    }

    return {
      merchantId,
      merchantSecretKey,
      initiateSaleUrl,
      returnUrl,
      currencyCode
    };
  }

  /**
   * Generate unique merchant transaction number
   */
  private static generateMerchantTxnNo(): string {
    return `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  /**
   * Generate transaction date in format: YYYYMMDDHHmmss
   */
  private static generateTxnDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Format mobile number to include country code (91 for India)
   * Based on example: "17498791441" - can be 11 digits or with country code
   */
  private static formatMobileNumber(mobile: string): string {
    // Remove all non-digit characters
    const digits = mobile.replace(/\D/g, '');
    
    // If already starts with 91 (India), return as is
    if (digits.startsWith('91') && digits.length >= 12) {
      return digits;
    }
    
    // If 10 digits (Indian mobile), add 91 prefix
    if (digits.length === 10) {
      return `91${digits}`;
    }
    
    // If 11 digits and starts with 1 (like example: 17498791441), return as is
    if (digits.length === 11 && digits.startsWith('1')) {
      return digits;
    }
    
    // Return as is if already formatted or other format
    return digits;
  }

  /**
   * Calculate secure hash for PhiCommerce
   * Format: addlParam1 + addlParam2 + amount + currencyCode + customerEmailID + 
   *         customerMobileNo + merchantId + merchantTxnNo + payType + returnURL + 
   *         transactionType + txnDate + merchantSecretKey
   */
  private static calculateSecureHash(data: {
    addlParam1: string;
    addlParam2: string;
    amount: string;
    currencyCode: string;
    customerEmailID: string;
    customerMobileNo: string;
    merchantId: string;
    merchantTxnNo: string;
    payType: string;
    returnURL: string;
    transactionType: string;
    txnDate: string;
    // merchantSecretKey: string;
  }): string {
    // Concatenate fields in the specified order
    const hashText = 
      data.addlParam1 +
      data.addlParam2 +
      data.amount +
      data.currencyCode +
      data.customerEmailID +
      data.customerMobileNo +
      data.merchantId +
      data.merchantTxnNo +
      data.payType +
      data.returnURL +
      data.transactionType +
      data.txnDate

      console.log("hashText", hashText);

       // Create HMAC using SHA-256 algorithm
    const hmac = crypto.createHmac('sha256', "abc");
    
    // Update the HMAC with the message and compute the digest
    hmac.update(hashText);
    
    // Return the hexadecimal digest
    return hmac.digest('hex');

    // Calculate SHA-256 hash
    // const hash = crypto.createHash('sha256').update(hashText).digest('hex');
    
    // logger.info('Secure hash calculated', {
    //   hashLength: hash.length,
    //   hashTextLength: hashText.length
    // });

    // return hash;
  }

  /**
   * Initiate payment with PhiCommerce (Redirect Mode - payType = "0")
   */
  static async initiatePayment(paymentData: {
    enquiryId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    addlParam1?: string;
    addlParam2?: string;
  }): Promise<{ redirectUrl: string; merchantTxnNo: string; tranCtx?: string }> {
    const config = this.getConfig();
    const merchantTxnNo = this.generateMerchantTxnNo().slice(0, 20);
    const txnDate = this.generateTxnDate();
    // Format amount to 2 decimal places
    const amount = paymentData.amount.toFixed(2);
    
    // Format mobile number
    const customerMobileNo = this.formatMobileNumber(paymentData.customerMobile);

    // Prepare additional parameters
    const addlParam1 = paymentData.addlParam1 || `Enquiry_${paymentData.enquiryId}`;
    const addlParam2 = paymentData.addlParam2 || 'Admission Fee';

    // Calculate secure hash
    const secureHash = this.calculateSecureHash({
      addlParam1: "testing",
      addlParam2: "testing",
      amount: "300",
      currencyCode: "356",
      customerEmailID: paymentData.customerEmail,
      customerMobileNo: paymentData.customerMobile,
      merchantId: "T_08883",
      merchantTxnNo,
      payType: '0', // Redirect mode - capture payment on PG page
      returnURL: "http://localhost:3000/payment/callback",
      transactionType: 'SALE',
      txnDate
      // merchantSecretKey: "abc"
    });
    // Prepare request payload - matching exact API format from documentation
    // Order and field names must match exactly as per API specification
    const requestPayload = {
      "merchantId": "T_08883",
      "merchantTxnNo": merchantTxnNo,
      "amount": 300.00,
      "currencyCode": "356",
      "payType": "0",       // This is to capture payment details on PG payament page
      "customerEmailID": paymentData.customerEmail,
      "transactionType": "SALE",
      "txnDate": txnDate,
      "returnURL": "http://localhost:3000/payment/callback",
      "secureHash": secureHash,
      "customerMobileNo": paymentData.customerMobile,
      "addlParam1": "testing",
      "addlParam2": "testing"  
    };

    logger.info('Initiating PhiCommerce payment', {
      merchantTxnNo,
      amount,
      merchantId: config.merchantId,
      enquiryId: paymentData.enquiryId
    });

    // Log the exact payload being sent (without secureHash for security)
    logger.info('PhiCommerce InitiateSale request payload', {
      merchantId: requestPayload.merchantId,
      merchantTxnNo: requestPayload.merchantTxnNo,
      amount: requestPayload.amount,
      currencyCode: requestPayload.currencyCode,
      payType: requestPayload.payType,
      customerEmailID: requestPayload.customerEmailID,
      transactionType: requestPayload.transactionType,
      txnDate: requestPayload.txnDate,
      returnURL: requestPayload.returnURL,
      customerMobileNo: requestPayload.customerMobileNo,
      addlParam1: requestPayload.addlParam1,
      addlParam2: requestPayload.addlParam2,
      // secureHashLength: requestPayload.secureHash.length
    });

    try {
      // Call InitiateSale API
      const response = await axios.post(config.initiateSaleUrl, requestPayload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });

      console.log("response", response);

      // logger.info('PhiCommerce InitiateSale response', {
        
      // });

      // Check response
      if (response.data?.responseCode !== 'R1000') {
        throw new CustomError(
          `Payment initiation failed: ${response.data?.responseCode || 'Unknown error'}`,
          400
        );
      }

      // Extract redirect URI and transaction context
      const redirectURI = response.data.redirectURI;
      const tranCtx = response.data.tranCtx;

      if (!redirectURI) {
        throw new CustomError('Invalid response from payment gateway: missing redirectURI', 500);
      }

      // Build redirect URL
      const redirectUrl = tranCtx 
        ? `${redirectURI}?tranCtx=${tranCtx}`
        : redirectURI;

      logger.info('Payment initiated successfully', {
        redirectUrl,
        tranCtx,
        merchantTxnNo
      });

      return {
        redirectUrl,
        merchantTxnNo,
        tranCtx
      };
    } catch (error: any) {
      logger.error('PhiCommerce payment initiation error', {
        error: error.message,
        response: error.response?.data,
        merchantTxnNo
      });

      throw new CustomError(
        `Failed to initiate payment: ${error.response?.data?.message || error.message || 'Unknown error'}`,
        500
      );
    }
  }

  /**
   * Handle payment callback from PhiCommerce
   * Callback parameters: secureHash, amount, respdescription, paymentMode, customerEmailID, 
   * addlParam2, responseCode, customerMobileNo, paymentSubInstType, merchantId, paymentID, 
   * merchantTxnNo, addlParam1, paymentDateTime, txnID
   */
  static handlePaymentCallback(callbackData: any): {
    merchantTxnNo: string;
    responseCode: string;
    txnID?: string;
    amount?: string;
    status: 'success' | 'failed';
    respdescription?: string;
  } {
    const { merchantTxnNo, responseCode, txnID, amount, respdescription } = callbackData;

    if (!merchantTxnNo) {
      throw new CustomError('Merchant Transaction Number is required', 400);
    }

    // Check if payment is successful
    // responseCode: 0000 or 000 means success
    const isSuccess = responseCode === '0000' || responseCode === '000';

    logger.info('PhiCommerce payment callback processed', {
      merchantTxnNo,
      responseCode,
      status: isSuccess ? 'success' : 'failed',
      txnID
    });

    return {
      merchantTxnNo,
      responseCode,
      txnID,
      amount,
      status: isSuccess ? 'success' : 'failed',
      respdescription
    };
  }
}

