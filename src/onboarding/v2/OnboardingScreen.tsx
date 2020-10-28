import { useDimensions } from '@react-native-community/hooks';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import CenteredLoading from '../../common/components/CenteredLoading';

import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import useOnboardingProgress from './useOnboardingProgress';

/**
 * initial onboarding
 */
export default observer(function OnboardingScreen() {
  const theme = ThemedStyles.style;
  const { width } = useDimensions().screen;
  const navigation = useNavigation();
  const progressStore = useOnboardingProgress();

  // reload data when we return to the screen
  useFocusEffect(
    React.useCallback(() => {
      if (progressStore.result && !progressStore.loading) {
        progressStore.fetch();
      }
    }, [progressStore]),
  );

  const stepsMapping = {
    VerifyEmailStep: {
      title: i18n.t('onboarding.verifyEmailAddress'),
      screen: 'VerifyEmail',
    },
    SuggestedHashtagsStep: {
      title: i18n.t('onboarding.selectTags'),
      screen: 'SelectHashtags',
    },
    SetupChannelStep: {
      title: i18n.t('onboarding.setupChannel'),
      screen: 'SetupChannel',
    },
    VerifyUniquenessStep: {
      title: i18n.t('onboarding.verifyUniqueness'),
      screen: 'VerifyUniqueness',
    },
    CreatePostStep: {
      title: i18n.t('createAPost'),
      screen: 'SetupChannel',
    },
  };

  const steps = progressStore.result
    ? progressStore.result.steps.map((s) =>
        stepsMapping[s.id]
          ? {
              title: stepsMapping[s.id].title,
              is_completed: s.is_completed,
              onPress: () =>
                navigation.navigate(stepsMapping[s.id].screen, {
                  store: progressStore,
                }),
            }
          : null,
      )
    : [];

  const body =
    !progressStore.result && progressStore.loading ? (
      <CenteredLoading />
    ) : progressStore.error ? (
      <Text
        onPress={progressStore.fetch}
        style={[
          theme.fontXL,
          theme.colorSecondaryText,
          theme.padding4x,
          theme.textCenter,
        ]}>
        {i18n.t('onboarding.couldntLoadStatus') + '\n\n'}
        <Text style={[theme.fontL, theme.textCenter]}>
          {i18n.t('tryAgain')}
        </Text>
      </Text>
    ) : (
      <>
        <View style={[theme.padding4x, theme.marginVertical2x]}>
          <Text
            style={[
              theme.fontXXL,
              theme.colorPrimaryText,
              theme.bold,
              theme.marginBottom3x,
            ]}>
            {i18n.t('onboarding.completeToEarn')}
          </Text>
          <Progress.Bar
            color={ThemedStyles.getColor('link')}
            unfilledColor={ThemedStyles.getColor('secondary_text')}
            progress={progressStore.result?.completed_pct}
            width={width - 40}
            borderWidth={0}
            height={8}
          />
        </View>
        {steps.map((item) =>
          item ? (
            <MenuItem
              item={item}
              titleStyle={[
                item.is_completed
                  ? theme.colorSecondaryText
                  : theme.colorPrimaryText,
                item.is_completed ? theme.strikethrough : null,
              ]}
            />
          ) : null,
        )}
      </>
    );

  return (
    <View style={[theme.backgroundSecondary, theme.flexContainer]}>{body}</View>
  );
});
