//@ts-nocheck
// Temporal solution as we are migrating to the official stripe SDK
// import stripe from 'tipsi-stripe';
import mindsConfigService from './minds-config.service';

let intialized = false;

export const initStripe = async () => {
  if (intialized) return;
  intialized = true;

  const settings = mindsConfigService.getSettings();

  // await stripe.setOptions({
  //   publishableKey: settings.stripe_key,
  //   //androidPayMode: 'test', // Android only
  // });
};

export default {
  paymentRequestWithCardForm: (arg: any) => ({} as any),
  confirmSetupIntent: (arg: any) => ({} as any),
};
