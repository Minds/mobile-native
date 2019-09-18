import stripe from 'tipsi-stripe';
import mindsService from './minds.service';

let intialized = false;

export const initStripe = async() => {
  if (intialized) return;
  intialized = true;

  const settings = await mindsService.getSettings();

  await stripe.setOptions({
    publishableKey: settings.stripe_key,
    //androidPayMode: 'test', // Android only
  });
}

export default stripe;

