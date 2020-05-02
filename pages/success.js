import React, { useEffect } from 'react';

import { useShoppingCart } from 'use-shopping-cart';

const success = () => {
  const { clearCart } = useShoppingCart();

  useEffect(() => clearCart(), []);

  return (
    <main>
      <h1>Thanks for your purchase heart ❤️</h1>
    </main>
  );
};

export default success;
