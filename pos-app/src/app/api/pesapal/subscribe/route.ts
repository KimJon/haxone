import { NextResponse } from 'next/server';

const VERCEL_URL = 'https://haxone-2xp5voa6c-viccys-projects-45ec7e86.vercel.app';
const CONSUMER_KEY = 'sW5rrT5z4WzFUKj4zp5i7XCk6+sDy1nr';
const CONSUMER_SECRET = 'Ppyk27O3G4DKboVftHOPAUI5A14=';

export async function POST(req: Request) {
  try {
    const { amount, planName, email, phone, firstName, lastName } = await req.json();

    // 1. Get PesaPal Auth Token
    const authRes = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
    });

    if (!authRes.ok) {
      return NextResponse.json({ error: 'Failed to authenticate with payment gateway' }, { status: 500 });
    }

    const { token } = await authRes.json();

    // 2. Register IPN URL (points to our live Vercel server)
    let ipnId = 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2';
    const ipnRes = await fetch('https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url: `${VERCEL_URL}/api/pesapal/ipn`,
        ipn_notification_type: 'POST'
      })
    });

    if (ipnRes.ok) {
      const ipnData = await ipnRes.json();
      ipnId = ipnData.ipn_id || ipnId;
    }

    // 3. Submit Order — after payment PesaPal redirects to /setup
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    const orderId = `SUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderRes = await fetch('https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: orderId,
        currency: 'KES',
        amount: parsedAmount,
        description: `HaxOne POS - ${planName} Plan Subscription`,
        callback_url: `${VERCEL_URL}/setup?plan=${encodeURIComponent(planName)}&status=paid`,
        notification_id: ipnId,
        billing_address: {
          email_address: email || '',
          phone_number: phone || '',
          country_code: 'KE',
          first_name: firstName || '',
          middle_name: '',
          last_name: lastName || '',
          line_1: '',
          line_2: '',
          city: 'Nairobi',
          state: 'Nairobi',
          postal_code: '',
          zip_code: ''
        }
      })
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      console.error('PesaPal Order Error:', err);
      return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
    }

    const orderData = await orderRes.json();
    return NextResponse.json({ redirect_url: orderData.redirect_url });

  } catch (err: any) {
    console.error('PesaPal Subscribe Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
