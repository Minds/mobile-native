import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import MenuItem from '../../common/components/menus/MenuItem';

import { Tooltip } from 'react-native-elements';
import useOnboardingProgress from './useOnboardingProgress';
import { observer } from 'mobx-react';

import { Spacer } from '~/common/ui';
import { useThrottledCallback } from '~/common/hooks/useDebouncedCallback';
import sp from '~/services/serviceProvider';

let shownOnce = false;
/**
 * Initial onboarding button
 */
export default observer(function InitialOnboardingButton() {
  const theme = sp.styles.style;
  const tooltipRef = useRef<Tooltip>(null);
  const navigation = useNavigation();

  // get onboarding progress
  const progressStore = useOnboardingProgress();
  const settings = sp.resolve('settings');
  const i18n = sp.i18n;

  useFocusEffect(
    useThrottledCallback(
      () => {
        if (
          settings.ignoreOnboarding &&
          settings.ignoreOnboarding.isAfter(moment())
        ) {
          return;
        }
        if (!progressStore.loading) {
          progressStore.fetch();
        }
        // reload in 3 seconds (the post check has some delay)
        setTimeout(() => {
          if (progressStore && !progressStore.loading) {
            progressStore.fetch();
          }
        }, 3000);
      },
      2000,
      [progressStore],
    ),
  );

  useEffect(() => {
    let t;
    if (!progressStore.result?.is_completed && !shownOnce) {
      t = setTimeout(() => {
        shownOnce = true;
        tooltipRef.current?.toggleTooltip();
      }, 2000);
    }
    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
  }, [progressStore.result]);

  const item = {
    title:
      progressStore.result?.id === 'OngoingOnboardingGroup'
        ? i18n.t('onboarding.improveExperience')
        : i18n.t('onboarding.startEarning'),
    onPress: () => navigation.navigate('Onboarding'),
  };

  if (
    !progressStore.result ||
    progressStore.result.is_completed ||
    (settings.ignoreOnboarding &&
      settings.ignoreOnboarding.isAfter(moment())) ||
    progressStore.result.id === 'OngoingOnboardingGroup' // disable ongoing onboarding temporarily
  ) {
    return null;
  }

  return (
    <Spacer bottom="S">
      <MenuItem {...item} titleStyle={theme.bold} testID="startOnboarding" />
    </Spacer>
  );
});
