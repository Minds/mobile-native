import { GOOGLE_PLAY_STORE, IS_IOS } from '~/config/Config';
import sp from '~/services/serviceProvider';

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
        key => sp.resolve('analytics').getFeatureFlag(key) === variation,
      )
    : sp.resolve('analytics').getFeatureFlag(featureKey) === variation;
}

/**
 * Update growthbook's attributes and features
 */
export function updateFeatureFlags() {
  sp.resolve('analytics').initFeatureFlags();
}

export function useIsFeatureOn(feature: FeatureID) {
  return sp.resolve('analytics').getFeatureFlag(feature);
}

export function useFeature(feature: FeatureID) {
  return sp.resolve('analytics').getFeatureFlag(feature);
}

export const useIsIOSFeatureOn = (feature: FeatureID) =>
  useIsFeatureOn(feature) && IS_IOS;

export const useIsAndroidFeatureOn = (feature: FeatureID) =>
  useIsFeatureOn(feature) && !IS_IOS;

export const useIsGoogleFeatureOn = (feature: FeatureID) =>
  useIsFeatureOn(feature) && GOOGLE_PLAY_STORE;

export const featureList = [
  'epic-358-chat-mob',
  'mobile-create-group-chat-new',
] as const;

export type FeatureID = typeof featureList[number];
