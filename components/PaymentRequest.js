import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useShoppingCart } from 'use-shopping-cart';

import {
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';

const handlePaymentMethodReceived = async ({ event, cartDetails, stripe }) => {
  // Create PaymentIntent
  const { clientSecret } = await fetch('/api/payment_intents', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartDetails),
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.log(error);
      event.complete('fail');
    });
  // Confirm the PaymentIntent with the payment method returned from the payment request.
  const { error } = await stripe.confirmCardPayment(
    clientSecret,
    {
      payment_method: event.paymentMethod.id,
      shipping: {
        name: event.shippingAddress.recipient,
        phone: event.shippingAddress.phone,
        address: {
          line1: event.shippingAddress.addressLine[0],
          city: event.shippingAddress.city,
          postal_code: event.shippingAddress.postalCode,
          state: event.shippingAddress.region,
          country: event.shippingAddress.country,
        },
      },
    },
    { handleActions: false }
  );
  if (error) {
    // Report to the browser that the payment failed.
    console.log(error);
    event.complete('fail');
  } else {
    // Report to the browser that the confirmation was successful, prompting
    // it to close the browser payment method collection interface.
    event.complete('success');
    // Let Stripe.js handle the rest of the payment flow, including 3D Secure if needed.
    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret);
    if (paymentIntent.status === 'succeeded') {
      // router.push('/success');
    }
  }
};

const PaymentRequest = () => {
  const router = useRouter();
  const { cartItems, cartDetails } = useShoppingCart();
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Demo total',
          amount: cartItems.reduce((sum, { price }) => sum + price, 350),
          pending: true,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: true,
        shippingOptions: [
          {
            id: 'standard-global',
            label: 'Global shipping',
            detail: 'Handling and delivery fee',
            amount: 350,
          },
        ],
      });
      // Check the availability of the Payment Request API first.
      pr.canMakePayment().then((result) => {
        if (result) {
          pr.on('paymentmethod', (event) =>
            handlePaymentMethodReceived({ event, cartDetails, stripe })
          );
          setPaymentRequest(pr);
        }
      });
    } else if (paymentRequest) {
      paymentRequest.update({
        total: {
          label: 'Demo total',
          amount: cartItems.reduce((sum, { price }) => sum + price, 350),
          pending: false,
        },
      });
    }
  }, [stripe, paymentRequest, cartItems]);

  if (paymentRequest) {
    return (
      <div className="payment-request-button">
        <PaymentRequestButtonElement options={{ paymentRequest }} />
        --- OR ---
      </div>
    );
  }

  return '';
};

export default PaymentRequest;
