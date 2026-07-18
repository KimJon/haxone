/* ============================================================
   HaxOne Payment Platform — mock-api.js
   Simulated gateway API responses
   ============================================================ */
(function () {
  'use strict';

  const delay = ms => new Promise(r => setTimeout(r, ms));
  const rand  = (min, max) => Math.random() * (max - min) + min;

  const MockAPI = {

    /* ── M-Pesa STK Push ── */
    async initSTKPush({ phone, amount, accountRef, description }) {
      await delay(rand(600, 1000));
      if (Math.random() < 0.05) throw new Error('Request failed: Safaricom API temporarily unavailable.');
      return {
        MerchantRequestID: 'MR-' + Date.now(),
        CheckoutRequestID: 'ws_CO_' + Date.now() + Math.random().toString(36).substr(2, 6),
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: 'Success. Request accepted for processing'
      };
    },

    /* ── Poll for STK Callback result ── */
    async pollSTKStatus(checkoutRequestId) {
      await delay(rand(4000, 10000)); // simulate user PIN entry time
      const r = Math.random();
      if (r > 0.12) {
        return {
          ResultCode: '0',
          ResultDesc: 'The service request is processed successfully.',
          MpesaReceiptNumber: 'QHX' + Math.random().toString(36).substr(2, 7).toUpperCase(),
          Amount: null,
          TransactionDate: Date.now(),
          PhoneNumber: ''
        };
      } else if (r > 0.04) {
        return { ResultCode: '1032', ResultDesc: 'Request cancelled by user.' };
      } else {
        return { ResultCode: '1037', ResultDesc: 'DS timeout user cannot be reached.' };
      }
    },

    /* ── M-Pesa Balance Inquiry ── */
    async balanceInquiry() {
      await delay(rand(900, 1400));
      const bal = rand(50000, 850000).toFixed(2);
      return {
        ResultCode: '0',
        WorkingAccount: 'Working Account|KES|' + bal,
        UtilityAccount: 'Utility Account|KES|' + rand(5000, 120000).toFixed(2),
        Charges: 'Charges Paid Account|KES|0.00'
      };
    },

    /* ── Transaction Status Query ── */
    async transactionStatus(transactionId) {
      await delay(rand(700, 1200));
      return {
        ResultCode: '0',
        ResultDesc: 'The service request is processed successfully.',
        OriginatorConversationID: transactionId,
        ConversationID: 'AG_' + Date.now(),
        TransactionStatus: 'Completed',
        ResultType: 0
      };
    },

    /* ── B2C Payment ── */
    async b2cPayment({ phone, amount, occasion }) {
      await delay(rand(1000, 1800));
      if (Math.random() < 0.06) throw new Error('B2C Payment failed: Insufficient funds in business account.');
      return {
        ConversationID: 'AG_' + Date.now(),
        OriginatorConversationID: 'HX-B2C-' + Date.now(),
        ResponseCode: '0',
        ResponseDescription: 'Accept the service request successfully.',
        ReceiverPartyPublicName: 'Customer',
        TransactionAmount: amount,
        TransactionReceipt: 'QBX' + Math.random().toString(36).substr(2, 7).toUpperCase()
      };
    },

    /* ── Transaction Reversal ── */
    async reverseTransaction(transactionId) {
      await delay(rand(1200, 2000));
      if (Math.random() < 0.08) throw new Error('Reversal failed: Transaction too old or already reversed.');
      return {
        ResultCode: '0',
        ResultDesc: 'The service request has been accepted successfully.',
        OriginalTransactionID: transactionId
      };
    },

    /* ── Refund ── */
    async processRefund({ transactionId, amount, reason }) {
      await delay(rand(1000, 1600));
      if (Math.random() < 0.05) throw new Error('Refund failed: Insufficient merchant balance.');
      return {
        success: true,
        refundId: 'REF-' + Date.now(),
        amount,
        reason,
        message: 'Refund of KSh ' + amount + ' processed successfully.',
        timestamp: new Date().toISOString()
      };
    },

    /* ── PayPal Order ── */
    async createPayPalOrder({ amount, currency }) {
      await delay(rand(500, 900));
      return {
        id: 'PAYPAL-' + Math.random().toString(36).substr(2, 10).toUpperCase(),
        status: 'CREATED',
        amount: { currency_code: currency || 'USD', value: (amount / 130).toFixed(2) },
        links: [{ rel: 'approve', href: '#paypal-approval' }]
      };
    },

    async capturePayPalOrder(orderId) {
      await delay(rand(1500, 2500));
      return {
        id: orderId,
        status: 'COMPLETED',
        payer: { email_address: 'customer@example.com', name: { given_name: 'John', surname: 'Doe' } },
        purchase_units: [{ payments: { captures: [{ id: 'CAP-' + Date.now(), status: 'COMPLETED' }] } }]
      };
    },

    /* ── Gateway Connection Test ── */
    async testGatewayConnection(gateway) {
      await delay(rand(800, 1600));
      const results = {
        daraja:      { success: true,  message: 'Daraja API connected. Access token retrieved successfully.', ping: Math.round(rand(90, 200)) + 'ms' },
        pesapal:     { success: true,  message: 'Pesapal sandbox connected. OAuth token valid.', ping: Math.round(rand(60, 150)) + 'ms' },
        paystack:    { success: true,  message: 'Paystack API connected. Business verified.', ping: Math.round(rand(40, 100)) + 'ms' },
        flutterwave: { success: true,  message: 'Flutterwave connected. Public key validated.', ping: Math.round(rand(70, 140)) + 'ms' },
        stripe:      { success: true,  message: 'Stripe API connected. Account active.', ping: Math.round(rand(30, 80)) + 'ms' },
        paypal:      { success: true,  message: 'PayPal sandbox connected. Client credentials valid.', ping: Math.round(rand(80, 160)) + 'ms' },
        dpo:         { success: Math.random() > 0.2, message: 'DPO Group API tested.', ping: Math.round(rand(150, 300)) + 'ms' }
      };
      const r = results[gateway] || { success: false, message: 'Unknown gateway.', ping: '-' };
      if (!r.success) throw new Error(r.message || 'Connection failed.');
      return r;
    },

    /* ── Settlement Report ── */
    async getSettlementReport(date) {
      await delay(rand(600, 1000));
      const txns = window.HaxOne.store.get('transactions') || [];
      const dateStr = date || new Date().toISOString().split('T')[0];
      const dayTxns = txns.filter(t => t.timestamp.startsWith(dateStr));
      return {
        date: dateStr,
        totalTransactions: dayTxns.length,
        successful: dayTxns.filter(t => t.status === 'success').length,
        failed: dayTxns.filter(t => t.status === 'failed').length,
        pending: dayTxns.filter(t => t.status === 'pending').length,
        grossAmount: dayTxns.filter(t => t.status === 'success').reduce((s, t) => s + t.amount, 0),
        totalFees: dayTxns.reduce((s, t) => s + (t.fee || 0), 0),
        netAmount: dayTxns.filter(t => t.status === 'success').reduce((s, t) => s + t.amount - (t.fee || 0), 0),
        gateways: ['daraja', 'paypal', 'stripe', 'flutterwave', 'pesapal'].map(gw => ({
          name: gw,
          transactions: txns.filter(t => t.gateway === gw).length,
          amount: txns.filter(t => t.gateway === gw && t.status === 'success').reduce((s, t) => s + t.amount, 0),
          fees: txns.filter(t => t.gateway === gw).reduce((s, t) => s + (t.fee || 0), 0)
        }))
      };
    },

    /* ── Generate Payment Link ── */
    async generatePaymentLink({ amount, description, expiresInHours }) {
      await delay(rand(400, 700));
      const linkId = 'LINK-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      return {
        linkId,
        payment_url: 'https://pay.haxone.com/' + linkId,
        amount,
        description,
        expires_at: new Date(Date.now() + (expiresInHours || 24) * 3600000).toISOString()
      };
    },

    /* ── Generate QR ── */
    async generateQRCode({ amount, merchantId, accountRef }) {
      await delay(rand(300, 600));
      const qrData = `HaxOne|${merchantId || 'HXSTRE001'}|${accountRef || 'ACCOUNT'}|${amount || ''}`;
      return {
        qr_code_url: 'https://api.haxone.com/qr/' + Math.random().toString(36).substr(2, 8),
        qr_data: qrData,
        expires_at: new Date(Date.now() + 1800000).toISOString()
      };
    },

    /* ── Bulk Payment Collection ── */
    async bulkCollect({ customers, description }) {
      await delay(rand(1000, 2000));
      const batchId = 'BATCH-' + Date.now();
      return {
        batch_id: batchId,
        total_count: customers.length,
        initiated_count: customers.length,
        status: 'processing',
        description,
        created_at: new Date().toISOString()
      };
    },

    /* ── Recurring Subscription ── */
    async createSubscription({ customerPhone, amount, frequency, startDate, description }) {
      await delay(rand(500, 900));
      return {
        subscription_id: 'SUB-' + Date.now(),
        status: 'active',
        customer_phone: customerPhone,
        amount,
        frequency,
        start_date: startDate,
        next_charge_date: startDate,
        description
      };
    },

    /* ── Fraud Check ── */
    generateFraudAlerts() {
      const alerts = [
        { id: 1, severity: 'high', message: 'Large transaction: KSh 85,000 requires approval', time: '2 min ago', action: 'review', icon: '🚨' },
        { id: 2, severity: 'medium', message: 'Multiple failed attempts from +254720123456 (5 in 10 min)', time: '8 min ago', action: 'block', icon: '⚠️' },
        { id: 3, severity: 'low', message: 'Velocity check passed for TXN000047', time: '15 min ago', action: null, icon: '✅' },
        { id: 4, severity: 'medium', message: 'Unusual transaction pattern: 3 transactions in 2 minutes', time: '22 min ago', action: 'review', icon: '⚠️' },
        { id: 5, severity: 'low', message: 'New device detected for merchant login', time: '1h ago', action: 'verify', icon: '🔐' },
        { id: 6, severity: 'high', message: 'Duplicate transaction suspected: TXN000032 & TXN000033', time: '2h ago', action: 'investigate', icon: '🚨' }
      ];
      return alerts;
    }
  };

  window.HaxOne = window.HaxOne || {};
  window.HaxOne.mockAPI = MockAPI;
})();
