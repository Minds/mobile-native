//@ts-nocheck
import stripe from 'tipsi-stripe';
import mindsConfigService from './minds-config.service';

let intialized = false;

export const initStripe = async () => {
  if (intialized) return;
  intialized = true;

  const settings = mindsConfigService.getSettings();

  await stripe.setOptions({
    publishableKey: settings.stripe_key,
    //androidPayMode: 'test', // Android only
  });
};

export default stripe;
