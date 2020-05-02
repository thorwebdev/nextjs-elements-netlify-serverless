import { loadStripe } from '@stripe/stripe-js';
import { CartProvider } from 'use-shopping-cart';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
import { Elements } from '@stripe/react-stripe-js';

import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <Elements stripe={stripePromise}>
      <CartProvider stripe={stripePromise} currency="USD">
        <header>
          <a href="/" rel="home">
            Serverless Shopping Cart & Mobile Payments
          </a>
        </header>

        <Component {...pageProps} />

        <footer>
          <p>
            Based on an{' '}
            <a href="https://www.learnwithjason.dev/add-apple-pay-google-pay-to-jamstack-sites">
              episode of <em>Learn With Jason</em>
            </a>{' '}
            ·<a href="#EGGHEAD-link">watch the video course</a> ·
            <a href="#TKTK-tutorial-link">read the tutorial</a> ·
            <a href="https://github.com/stripe-samples/checkout-netlify-serverless">
              source code
            </a>
          </p>
        </footer>
      </CartProvider>
    </Elements>
  );
}
