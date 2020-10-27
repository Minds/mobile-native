import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import { LIGHT_THEME } from '../../styles/Colors';
import ThemedStyles from '../../styles/ThemedStyles';
import { Tooltip, Text } from 'react-native-elements';
import { useDimensions } from '@react-native-community/hooks';

/**
 * Initial onboarding button
 */
export default function InitialOnboardingButton() {
  const theme = ThemedStyles.style;
  const tooltipRef = useRef<Tooltip>(null);
  const navigation = useNavigation();
  const { width } = useDimensions().screen;

  useEffect(() => {
    const t = setTimeout(() => {
      tooltipRef.current?.toggleTooltip();
    }, 1000);

    return () => t && clearTimeout(t);
  }, []);

  const { current: item } = useRef({
    title: i18n.t('onboarding.startEarning'),
    onPress: () =>
      navigation.navigate('Tabs', {
        screen: 'CaptureTab',
        params: { screen: 'Onboarding' },
      }),
  });

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
}

const containerStyle = { left: 20, borderRadius: 2 };
