import React from 'react';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import DeviceInfo from 'react-native-device-info';

import analyticsService from '~/common/services/analytics.service';
import mindsConfigService from '~/common/services/minds-config.service';
import sessionService from '~/common/services/session.service';
import { storages } from '~/common/services/storage/storages.service';

export const growthbook = new GrowthBook({
  trackingCallback: (experiment, result) => {
    const CACHE_KEY = `experiment:${experiment.key}`;
    const date = storages.user?.getInt(CACHE_KEY);
    if (date && date > Date.now() - 86400000) {
      return; // Do not emit event
    } else {
      storages.user?.setInt(CACHE_KEY, Date.now());
    }
    analyticsService.addExperiment(experiment.key, result.variationId);
  },
});

/**
 * Update growthbook's attributes and features
 */
export function updateGrowthBookAttributes() {
  const user = sessionService.getUser();
  const config = mindsConfigService.getSettings();
  const userId = user?.guid || DeviceInfo.getUniqueId();
  if (config.growthbook) {
    growthbook.setFeatures(config.growthbook?.features);
    growthbook.setAttributes({
      ...config.growthbook?.attributes,
      ...growthbook.getAttributes(),
      id: userId,
      user: {
        id: userId,
      },
    });
  }
}

export default function ExperimentsProvider({ children }) {
  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}
