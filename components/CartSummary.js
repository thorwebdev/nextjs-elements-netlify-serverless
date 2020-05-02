import React, { useState } from 'react';

import { useShoppingCart } from 'use-shopping-cart';
import PaymentRequest from '../components/PaymentRequest';

const CartSummary = () => {
  const [loading, setLoading] = useState(false);
  const {
    totalPrice,
    cartCount,
    clearCart,
    cartDetails,
    redirectToCheckout,
  } = useShoppingCart();

  const handleCheckout = async (event) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch('/api/checkout_sessions', {
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
        setLoading(false);
      });

    redirectToCheckout({ sessionId: response.sessionId });
  };

  return (
    <div>
      <h2>Cart summary</h2>
      {/* This is where we'll render our cart */}
      <p>Number of Items: {cartCount}</p>
      <p>Total: {totalPrice()}</p>

      <PaymentRequest />
      {/* Redirects the user to Stripe */}
      <button disabled={!cartCount || loading} onClick={handleCheckout}>
        Checkout
      </button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

export default CartSummary;
