//@ts-nocheck
import React, { useCallback } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import colors from '../../styles/Colors';
import navigationService from '../../navigation/NavigationService';
import i18n from '../../common/services/i18n.service';
import featuresService from '../../common/services/features.service';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * Complete Profile
 */
export default function ({ progress }) {
  const theme = ThemedStyles.style;
  const textStyle = [
    theme.fontS,
    theme.paddingTop2x,
    theme.textCenter,
    theme.colorSecondaryText,
  ];

  const getProgressBar = useCallback(() => {
    const percent = {
      amount: <Text style={theme.bold}>{Math.round(progress * 100)}%</Text>,
    };
    return (
      <TouchableOpacity
        style={[theme.padding2x, theme.backgroundSecondary]}
        onPress={() => navigationService.push(onboarding)}>
        <Progress.Bar progress={progress} width={null} color={colors.greyed} />
        <Text style={textStyle}>
          {progress < 1
            ? i18n.to('onboarding.haveCompleted', null, percent)
            : i18n.t('onboarding.editProfile')}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  let onboarding = 'OnboardingScreen';

  return getProgressBar();
}
