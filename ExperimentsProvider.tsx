import analyticsService from '~/common/services/analytics.service';
import { GOOGLE_PLAY_STORE, IS_IOS } from '~/config/Config';

/**
 * Return whether a feature has a given variation state.
 * @param { string } featureKey - growthbook feature key.
 * @param { string|number|boolean } variation - variation to check, e.g. 'on' or 'off'.
 * @returns { boolean } - true if params reflect current variation.
 */
export function hasVariation(
  featureKey: FeatureID | FeatureID[],
  variation: boolean | string = true,
) {
  return Array.isArray(featureKey)
    ? featureKey.every(
        key => analyticsService.getFeatureFlag(key) === variation,
      )
    : analyticsService.getFeatureFlag(featureKey) === variation;
}

/**
 * Update growthbook's attributes and features
 */
export function updateFeatureFlags() {
  analyticsService.initFeatureFlags();
}

export function useIsFeatureOn(feature: FeatureID) {
  return analyticsService.getFeatureFlag(feature);
}

export function useFeature(feature: FeatureID) {
  return analyticsService.getFeatureFlag(feature);
}

export const useIsIOSFeatureOn = (feature: FeatureID) =>
  useIsFeatureOn(feature) && IS_IOS;

export const useIsAndroidFeatureOn = (feature: FeatureID) =>
  useIsFeatureOn(feature) && !IS_IOS;

export const useIsGoogleFeatureOn = (feature: FeatureID) =>
  useIsFeatureOn(feature) && GOOGLE_PLAY_STORE;

export const featureList = [
  'engine-2503-twitter-feats',
  'epic-303-boost-partners',
  'minds-3639-plus-notice',
  'mob-discovery-redirect',
  'mob-twitter-oauth-4715',
  'mob-4424-sockets',
  'mob-4472-in-app-verification',
  'mob-4596-create-modal',
  'mob-4637-ios-hide-minds-superminds',
  'mob-4722-track-code-push',
  'mob-4812-discovery-badge',
  'minds-3921-mandatory-onboarding-tags',
  'mob-4903-referrer-banner',
  'mob-4903-wefounder-banner',
  'minds-3952-boost-goals',
  'mob-4938-newsfeed-for-you',
  'mob-4952-boost-platform-targeting',
  'mob-5038-discovery-consolidation',
  'mob-5075-hide-post-on-downvote',
  'mob-5075-explicit-vote-buttons',
  'mob-5009-boost-rotator-in-feed',
  'mob-5221-google-hide-tokens',
] as const;

export type FeatureID = typeof featureList[number];
