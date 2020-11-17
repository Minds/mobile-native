import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import { LIGHT_THEME } from '../../styles/Colors';
import ThemedStyles from '../../styles/ThemedStyles';
import { Tooltip, Text } from 'react-native-elements';
import { useDimensions } from '@react-native-community/hooks';
import useOnboardingProgress from './useOnboardingProgress';
import { observer } from 'mobx-react';

/**
 * Initial onboarding button
 */
export default observer(function InitialOnboardingButton() {
  const theme = ThemedStyles.style;
  const tooltipRef = useRef<Tooltip>(null);
  const navigation = useNavigation();
  const { width } = useDimensions().screen;

  // get onboarding progress
  const progressStore = useOnboardingProgress();

  useEffect(() => {
    let t;
    if (!progressStore.result?.is_completed) {
      t = setTimeout(() => {
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
    onPress: () =>
      navigation.navigate('Tabs', {
        screen: 'CaptureTab',
        params: { screen: 'Onboarding' },
      }),
  };

  if (!progressStore.result || progressStore.result.is_completed) {
    return null;
  }

  return (
    <View>
      <MenuItem item={item} titleStyle={theme.bold} />
      <Tooltip
        ref={tooltipRef}
        width={width * 0.7}
        height={80}
        withOverlay={false}
        containerStyle={containerStyle}
        popover={
          <Text style={[theme.colorWhite, theme.fontL]}>
            {i18n.t('onboarding.tooltipInitial1') + '\n'}
            {i18n.t('onboarding.tooltipInitial2')}
          </Text>
        }
        backgroundColor={LIGHT_THEME.link}
      />
    </View>
  );
});

const containerStyle = { left: 20, borderRadius: 2 };
