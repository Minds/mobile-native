export type TranslationType = typeof en;

const en = {
  claim: {
    title: 'Claim your gift',
    description:
      'Boost credits can be used to Boost a post or your channel, which can help increase your reach, grow your subscriber base, and enhance your engagement.',
    button: 'Apply to your account',
    alreadyClaimed: 'Gift already claimed',
    error: 'Error retrieving gift card',
    errorButton: 'Try again',
    type: {
      BOOST: 'Boost Gift Card',
      PLUS: 'Plus Gift Card',
      PRO: 'Pro Gift Card',
      SUPERMIND: 'Supermind Gift Card',
    },
  },
  claimed: {
    title: 'Gift claimed',
    subtitle: 'Your Boost Credits have been applied to your account',
    detail: 'Updated Boost Credits Balance:',
    description:
      'You can <0>view your balances</0> in your Wallet in the Credits tab. It is not possible to transfer your credit balance to other accounts, utilize it for purchasing gifts for others, or redeem it for cash.',
    description2:
      'When making eligible purchases, your credit balance will be automatically chosen as the default payment method. However, if you prefer not to use your credit balance for a specific purchase, you can unselect it as the payment method.',
    button: 'Create a Boost',
  },
  Ascending: 'Newest to Oldest',
  Descending: 'Oldest to Newest',
  'No Credits':
    'You can view all your gifts, as well as their remaining balances, expiration, and transactions.',
};

export default en;
