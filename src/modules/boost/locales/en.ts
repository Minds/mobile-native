import { BoostGoal } from '../boost-composer/boost.store';

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
};

export default en;
