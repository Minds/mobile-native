import { useDimensions } from '@react-native-community/hooks';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import moment from 'moment-timezone';
import React, { useRef } from 'react';
import { View, TextStyle } from 'react-native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showNotification } from '../../../AppMessages';
import BottomButtonOptions, {
  ItemType,
} from '../../common/components/BottomButtonOptions';
import CenteredLoading from '../../common/components/CenteredLoading';

import MenuItem from '../../common/components/menus/MenuItem';
import MText from '../../common/components/MText';
import { useLegacyStores } from '../../common/hooks/use-stores';
import i18n from '../../common/services/i18n.service';
import sessionService from '../../common/services/session.service';
import SettingsStore from '../../settings/SettingsStore';
import ThemedStyles from '../../styles/ThemedStyles';
import useOnboardingProgress, {
  OnboardingGroupState,
} from './useOnboardingProgress';

type StepDefinition = {
  screen: string;
  title: string;
  onPress?: () => void;
};

/**
 * initial onboarding
 */
export default observer(function OnboardingScreen() {
  const theme = ThemedStyles.style;
  const { width } = useDimensions().screen;
  const navigation = useNavigation();
  const { newsfeed } = useLegacyStores();
  const onOnboardingCompleted = (message: string) => {
    setTimeout(() => {
      navigation.navigate('Newsfeed');
      showNotification(i18n.t(message), 'success', 4000);
    }, 300);
  };
  const updateState = (
    newData: OnboardingGroupState,
    oldData: OnboardingGroupState,
  ) => {
    if (newData && oldData && newData.id !== oldData.id) {
      onOnboardingCompleted('onboarding.onboardingCompleted');
      const m = moment().add(2, 'hours');
      SettingsStore.setIgnoreOnboarding(m);
      // show old data (initial onboarding)
      return oldData;
    } else if (newData && newData.is_completed) {
      onOnboardingCompleted('onboarding.improvedExperience');
    }

    // Check for post created locally (the backend check takes too long)
    if (newData.steps && newData.id === 'InitialOnboardingGroup') {
      const step = newData.steps.find(s => s.id === 'CreatePostStep');
      if (
        step &&
        !step.is_completed &&
        newsfeed.latestFeedStore.entities[0] &&
        newsfeed.latestFeedStore.entities[0].owner_guid ===
          sessionService.getUser().guid
      ) {
        step.is_completed = true;
        newData.is_completed = !newData.steps.some(s => !s.is_completed);
      }
    }

    return newData;
  };
  const progressStore = useOnboardingProgress(updateState);

  const store = useLocalStore(() => ({
    showMenu: false,
    saving: false,
    showPicker() {
      store.showMenu = true;
    },
    hidePicker() {
      store.showMenu = false;
    },
  }));

  // reload data when we return to the screen
  useFocusEffect(
    React.useCallback(() => {
      if (progressStore && progressStore.result && !progressStore.loading) {
        progressStore.fetch();
      }
      const interval = setInterval(() => {
        if (progressStore && progressStore.result && !progressStore.loading) {
          progressStore.fetch();
        }
      }, 3000);
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [progressStore]),
  );

  const stepsMapping: { [name: string]: StepDefinition } = useRef({
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
    SuggestedChannelsStep: {
      title: i18n.t('onboarding.subscribeToChannel'),
      screen: 'SuggestedChannel',
    },
    SuggestedGroupsStep: {
      title: i18n.t('onboarding.joinGroup'),
      screen: 'SuggestedGroups',
    },
    CreatePostStep: {
      title: i18n.t('createAPost'),
      screen: '',
      onPress: () =>
        navigation.navigate('Compose', {
          mode: 'text',
        }),
    },
  }).current;

  const dismissOptions: Array<Array<ItemType>> = useRef([
    [
      {
        title: i18n.t('onboarding.hidePanel'),
        titleStyle: theme.fontXXL,
        onPress: async () => {
          const m = moment().add(2, 'days');
          SettingsStore.setIgnoreOnboarding(m);
          store.hidePicker();
          navigation.goBack();
        },
      },
    ],
    [
      {
        title: i18n.t('cancel'),
        titleStyle: theme.colorSecondaryText,
        onPress: store.hidePicker,
      },
    ],
  ]).current;

  const steps = progressStore.result
    ? progressStore.result.steps.map(s =>
        stepsMapping[s.id]
          ? {
              title: stepsMapping[s.id].title,
              is_completed: s.is_completed,
              icon: s.is_completed
                ? { name: 'checkmark', color: ThemedStyles.getColor('Link') }
                : undefined,
              onPress:
                stepsMapping[s.id].onPress ||
                (() =>
                  navigation.navigate(
                    stepsMapping[s.id]
                      .screen as keyof ReactNavigation.RootParamList,
                    {
                      store: progressStore,
                    },
                  )),
            }
          : null,
      )
    : [];

  const body =
    !progressStore.result && progressStore.loading ? (
      <CenteredLoading />
    ) : progressStore.error ? (
      <MText
        onPress={progressStore.fetch}
        style={[
          theme.fontXL,
          theme.colorSecondaryText,
          theme.padding4x,
          theme.textCenter,
        ]}>
        {i18n.t('onboarding.couldntLoadStatus') + '\n\n'}
        <MText style={[theme.fontL, theme.textCenter]}>
          {i18n.t('tryAgain')}
        </MText>
      </MText>
    ) : (
      <>
        <View style={[theme.padding4x, theme.marginVertical2x]}>
          <View
            style={[
              theme.rowJustifySpaceBetween,
              theme.alignCenter,
              theme.marginBottom3x,
            ]}>
            <MText style={[theme.fontXXL, theme.colorPrimaryText, theme.bold]}>
              {progressStore.result?.id === 'OngoingOnboardingGroup'
                ? i18n.t('onboarding.improveExperience')
                : i18n.t('onboarding.completeToEarn')}
            </MText>
            <Icon
              name="more-vert"
              size={26}
              style={theme.colorPrimaryText}
              onPress={store.showPicker}
            />
          </View>
          <Progress.Bar
            color={ThemedStyles.getColor('Link')}
            unfilledColor={ThemedStyles.getColor('SecondaryText')}
            progress={progressStore.result?.completed_pct}
            width={width - 40}
            borderWidth={0}
            height={8}
          />
        </View>
        <BottomButtonOptions
          list={dismissOptions}
          isVisible={store.showMenu}
          onPressClose={store.hidePicker}
        />
        {steps.map(item =>
          item ? (
            <MenuItem
              item={item}
              titleStyle={
                [
                  item.is_completed
                    ? theme.colorSecondaryText
                    : theme.colorPrimaryText,
                  item.is_completed ? theme.strikeThrough : null,
                ] as TextStyle
              }
            />
          ) : null,
        )}
      </>
    );

  return (
    <View style={[theme.bgSecondaryBackground, theme.flexContainer]}>
      {body}
    </View>
  );
});
