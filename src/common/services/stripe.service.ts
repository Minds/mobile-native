import { initStripe as stripeInit } from '@stripe/stripe-react-native';
import sp from '~/services/serviceProvider';
let intialized = false;

export const initStripe = async () => {
  if (intialized) return;
  intialized = true;

  const settings = sp.config.getSettings();

  if (settings.stripe_key) {
    await stripeInit({
      publishableKey: settings.stripe_key,
    });
  }
};
