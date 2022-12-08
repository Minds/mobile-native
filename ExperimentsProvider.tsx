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
import { IS_IOS, IS_REVIEW } from '~/config/Config';

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
export function hasVariation(featureKey: FeatureID, variation: string = 'on') {
  const featureResult = growthbook.feature(featureKey);
  return featureResult[variation];
}

/**
 * Update growthbook's attributes and features
 */
export function updateGrowthBookAttributes() {
  const user = sessionService.getUser();
  const config = mindsConfigService.getSettings();
  const userId = sessionService.token ? user?.guid : DeviceInfo.getUniqueId();
  if (config.growthbook) {
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

export default function ExperimentsProvider({ children }) {
  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}

export const useIsIOSFeatureOn = (feature: FeatureID) =>
  useGrowthbookFeature(feature).on && IS_IOS;

export const useIsAndroidFeatureOn = (feature: FeatureID) =>
  useGrowthbookFeature(feature).on && !IS_IOS;

export type FeatureID =
  | 'mobile-supermind'
  | 'mob-4630-hide-chat-icon'
  | 'mob-4637-ios-hide-minds-superminds'
  | 'mob-stripe-connect-4587'
  | 'mob-4638-boost-v3'
  | 'mob-minds-3119-captcha-for-engagement'
  | 'mob-4424-sockets'
  | 'minds-3055-email-codes';
