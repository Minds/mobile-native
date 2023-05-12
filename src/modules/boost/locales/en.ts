import { BoostButtonText, BoostGoal } from '../boost-composer/boost.store';

export type TranslationType = typeof en;

const en = {
  dayWithCount: '{{count}} day',
  dayWithCount_plural: '{{count}} days',
  tokenWithCount: '{{count}} token',
  tokenWithCount_plural: '{{count}} tokens',

  goal: {
    [BoostGoal.VIEWS]: 'Expand reach',
    [BoostGoal.ENGAGEMENT]: 'Increase engagement',
    [BoostGoal.SUBSCRIBERS]: 'Grow your following',
    [BoostGoal.CLICKS]: 'Get more clicks',
  },
  goalText: {
    [BoostButtonText.LEARN_MORE]: 'Learn More',
    [BoostButtonText.GET_STARTED]: 'Get Started',
    [BoostButtonText.SIGN_UP]: 'Sign Up',
    [BoostButtonText.TRY_FOR_FREE]: 'Try For Free',
    [BoostButtonText.SUBSCRIBE_TO_MY_CHANNEL]: 'Subscribe to my channel',
    [BoostButtonText.GET_CONNECTED]: 'Get connected',
    [BoostButtonText.STAY_IN_THE_LOOP]: 'Stay in the loop',
  },
};

export default en;
