/**
 * Google Pay Integration Service
 * Handles Google Pay payment processing
 */

const GOOGLE_PAY_ENVIRONMENT = import.meta.env.VITE_GOOGLE_PAY_ENVIRONMENT || 'TEST';
const MERCHANT_ID = import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID;
const MERCHANT_NAME = import.meta.env.VITE_GOOGLE_PAY_MERCHANT_NAME || 'EliteStore';

// Base configuration for Google Pay
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};

// Tokenization specification
const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    gateway: 'example', // Replace with your payment gateway
    gatewayMerchantId: MERCHANT_ID || 'exampleGatewayMerchantId'
  }
};

// Card payment method
const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX']
  }
};

// Card payment method with tokenization
const cardPaymentMethod = {
  ...baseCardPaymentMethod,
  tokenizationSpecification: tokenizationSpecification
};

/**
 * Initialize Google Pay client
 */
export const getGooglePaymentsClient = () => {
  if (window.google && window.google.payments) {
    return new window.google.payments.api.PaymentsClient({
      environment: GOOGLE_PAY_ENVIRONMENT
    });
  }
  return null;
};

/**
 * Check if Google Pay is available
 */
export const isGooglePayAvailable = async () => {
  try {
    const paymentsClient = getGooglePaymentsClient();
    if (!paymentsClient) return false;

    const isReadyToPayRequest = {
      ...baseRequest,
      allowedPaymentMethods: [baseCardPaymentMethod]
    };

    const response = await paymentsClient.isReadyToPay(isReadyToPayRequest);
    return response.result;
  } catch (error) {
    console.error('Error checking Google Pay availability:', error);
    return false;
  }
};

/**
 * Create payment data request
 */
export const createPaymentDataRequest = (totalPrice, currencyCode = 'INR') => {
  return {
    ...baseRequest,
    allowedPaymentMethods: [cardPaymentMethod],
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: totalPrice.toString(),
      currencyCode: currencyCode,
      countryCode: 'IN'
    },
    merchantInfo: {
      merchantId: MERCHANT_ID,
      merchantName: MERCHANT_NAME
    },
    callbackIntents: ['PAYMENT_AUTHORIZATION']
  };
};

/**
 * Process Google Pay payment
 */
export const processGooglePayPayment = async (totalPrice) => {
  try {
    const paymentsClient = getGooglePaymentsClient();
    if (!paymentsClient) {
      throw new Error('Google Pay is not available');
    }

    const paymentDataRequest = createPaymentDataRequest(totalPrice);
    const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);

    // Extract payment token
    const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
    
    return {
      success: true,
      token: paymentToken,
      paymentData: paymentData
    };
  } catch (error) {
    console.error('Google Pay payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment failed'
    };
  }
};

/**
 * Load Google Pay script
 */
export const loadGooglePayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.payments) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Pay script'));
    document.head.appendChild(script);
  });
};

/**
 * Create Google Pay button
 */
export const createGooglePayButton = (onClick) => {
  const button = document.createElement('button');
  button.className = 'gpay-button';
  button.setAttribute('aria-label', 'Pay with Google Pay');
  button.onclick = onClick;
  
  // Add Google Pay button styling
  const style = document.createElement('style');
  style.textContent = `
    .gpay-button {
      background-color: #000;
      background-image: url(https://www.gstatic.com/instantbuy/svg/dark_gpay.svg);
      background-origin: content-box;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
      border: 0;
      border-radius: 4px;
      box-shadow: 0 1px 1px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
      cursor: pointer;
      height: 40px;
      min-height: 40px;
      padding: 11px 24px;
      width: 100%;
    }
    .gpay-button:hover {
      box-shadow: 0 1px 1px 0 rgba(60, 64, 67, .30), 0 2px 4px 2px rgba(60, 64, 67, .15);
    }
    .gpay-button:active {
      background-color: #5f6368;
    }
  `;
  
  if (!document.querySelector('style[data-gpay-button]')) {
    style.setAttribute('data-gpay-button', 'true');
    document.head.appendChild(style);
  }
  
  return button;
};