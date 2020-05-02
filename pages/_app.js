import { loadStripe } from '@stripe/stripe-js';
import { CartProvider } from 'use-shopping-cart';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider stripe={stripePromise} currency="USD">
      <header>
        <a href="/" rel="home">
          Serverless Workflow for Stripe Checkout
        </a>
      </header>

      <Component {...pageProps} />

      <footer>
        <p>
          Based on an{' '}
          <a href="https://www.learnwithjason.dev/sell-products-on-the-jamstack">
            episode of <em>Learn With Jason</em>
          </a>{' '}
          ·
          <a href="https://jason.af/egghead/stripe-products">
            watch the video course
          </a>{' '}
          ·<a href="#TKTK-tutorial-link">read the tutorial</a> ·
          <a href="https://github.com/stripe-samples/checkout-netlify-serverless">
            source code
          </a>
        </p>
      </footer>
    </CartProvider>
  );
}
