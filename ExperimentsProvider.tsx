import React from 'react';
import {
  GrowthBook,
  GrowthBookProvider,
  useFeature as useGrowthbookFeature,
} from '@growthbook/growthbook-react';
import DeviceInfo from 'react-native-device-info';

import analyticsService from '~/common/services/analytics.service';
import mindsConfigService from '~/common/services/minds-config.service';
import sessionService from '~/common/services/session.service';
import { storages } from '~/common/services/storage/storages.service';
import { GOOGLE_PLAY_STORE, IS_IOS, IS_REVIEW } from '~/config/Config';

export const growthbook = new GrowthBook({
  trackingCallback: (experiment, result) => {
    const CACHE_KEY = `experiment:${experiment.key}`;
    const date = storages.user?.getInt(CACHE_KEY);
    if (date && date > Date.now() - 86400000) {
      return; // Do not emit event
    } else {
      storages.user?.setInt(CACHE_KEY, Date.now());
    }
    if (!IS_REVIEW) {
      analyticsService.addExperiment(experiment.key, result.variationId);
    }
  },
});

/**
 * Return whether a feature has a given variation state.
 * @param { string } featureKey - growthbook feature key.
 * @param { string|number|boolean } variation - variation to check, e.g. 'on' or 'off'.
 * @returns { boolean } - true if params reflect current variation.
 */
export function hasVariation(
  featureKey: FeatureID | FeatureID[],
  variation: string = 'on',
) {
  return Array.isArray(featureKey)
    ? featureKey.every(key => growthbook.feature(key)[variation])
    : growthbook.feature(featureKey)[variation];
}

export function IfHasVariation({
  featureKey,
  children,
}: React.PropsWithChildren<{
  featureKey: FeatureID;
}>) {
  const on = useIsFeatureOn(featureKey);

  if (!on) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Update growthbook's attributes and features
 */
export function updateGrowthBookAttributes() {
  const user = sessionService.getUser();
  const config = mindsConfigService.getSettings();
  const userId = sessionService.token ? user?.guid : DeviceInfo.getUniqueId();
  if (config?.growthbook) {
    growthbook.setFeatures(config.growthbook?.features);
    growthbook.setAttributes({
      ...config.growthbook?.attributes,
      ...growthbook.getAttributes(),
      loggedIn: Boolean(sessionService.token),
      id: userId,
      appVersion: DeviceInfo.getVersion(),
      buildNumber: DeviceInfo.getBuildNumber(),
      platform: IS_IOS ? 'ios' : 'android',
      user: {
        id: userId,
      },
    });
  }
}

export function useIsFeatureOn(feature: FeatureID) {
  return useGrowthbookFeature(feature).on;
}

export function useFeature(feature: FeatureID) {
  return useGrowthbookFeature(feature);
}

export default function ExperimentsProvider({ children }) {
  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}

export const useIsIOSFeatureOn = (feature: FeatureID) =>
  useGrowthbookFeature(feature).on && IS_IOS;

export const useIsAndroidFeatureOn = (feature: FeatureID) =>
  useGrowthbookFeature(feature).on && !IS_IOS;

export const useIsGoogleFeatureOn = (feature: FeatureID) =>
  useGrowthbookFeature(feature).on && GOOGLE_PLAY_STORE;

export const featureList = [
  'engine-2503-twitter-feats',
  'epic-303-boost-partners',
  'minds-3055-email-codes',
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
  'epic-304-affiliates',
  'mob-4938-newsfeed-for-you',
  'mob-4952-boost-platform-targeting',
  'mob-5038-discovery-consolidation',
  'mob-5075-hide-post-on-downvote',
  'mob-5075-explicit-vote-buttons',
  'mob-5009-boost-rotator-in-feed',
  'mob-5221-google-hide-tokens',
] as const;

export type FeatureID = typeof featureList[number];
