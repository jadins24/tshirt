// lib/fedex.js

const FED_EX_BASE_URL = 'https://apis-sandbox.fedex.com';

export async function getFedExToken() {
  const res = await fetch(`${FED_EX_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.NEXT_PUBLIC_FEDEX_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_FEDEX_CLIENT_SECRET,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

export async function getFedExRates({ recipientPostalCode, countryCode = 'IN', weightKg = 1 }) {
  const token = await getFedExToken();

  const res = await fetch(`${FED_EX_BASE_URL}/rate/v1/rates/quotes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountNumber: { value: process.env.NEXT_PUBLIC_FEDEX_ACCOUNT_NUMBER },
      requestedShipment: {
        dropOffType: 'REGULAR_PICKUP',
        serviceType: 'FEDEX_GROUND',
        packagingType: 'YOUR_PACKAGING',
        shipper: {
          address: {
            postalCode: '560001', // Example origin (e.g., Bangalore)
            countryCode,
          },
        },
        recipient: {
          address: {
            postalCode: recipientPostalCode,
            countryCode,
          },
        },
        requestedPackageLineItems: [
          {
            weight: {
              units: 'KG',
              value: weightKg,
            },
          },
        ],
      },
    }),
  });

  const data = await res.json();
  return data;
}
