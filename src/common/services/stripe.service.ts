import mindsConfigService from './minds-config.service';
import { initStripe as stripeInit } from '@stripe/stripe-react-native';

let intialized = false;

export const initStripe = async () => {
  if (intialized) return;
  intialized = true;

  const settings = mindsConfigService.getSettings();

  await stripeInit({
    publishableKey: settings.stripe_key,
  });
};
