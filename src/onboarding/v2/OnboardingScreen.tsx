import { useDimensions } from '@react-native-community/hooks';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import moment from 'moment-timezone';
import React, { useRef } from 'react';
import { View, TextStyle } from 'react-native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  BottomSheetButton,
  BottomSheetModal,
} from '~/common/components/bottom-sheet';
import MenuItem, { MenuItemProps } from '~/common/components/menus/MenuItem';
import Topbar from '~/topbar/Topbar';
import { showNotification } from '../../../AppMessages';

import CenteredLoading from '../../common/components/CenteredLoading';

import MText from '../../common/components/MText';
import i18n from '../../common/services/i18n.service';
import SettingsStore from '../../settings/SettingsStore';
import ThemedStyles from '../../styles/ThemedStyles';
import useOnboardingProgress, {
  OnboardingGroupState,
} from './useOnboardingProgress';

import { hasVariation } from 'ExperimentsProvider';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type StepDefinition = {
  screen: string;
  title: string;
  onPress?: () => void;
};

/**
 * initial onboarding
 */
export default withErrorBoundaryScreen(
  observer(function OnboardingScreen() {
    const theme = ThemedStyles.style;
    const { width } = useDimensions().screen;
    const navigation = useNavigation();
    // Do not render BottomSheet unless it is necessary
    const ref = React.useRef<any>(null);
    const onOnboardingCompleted = () => {
      setTimeout(() => {
        navigation.navigate('Newsfeed');
        showNotification(
          i18n.t('onboarding.onboardingCompleted'),
          'success',
          4000,
        );
      }, 300);
    };

    const updateState = (
      newData: OnboardingGroupState,
      oldData: OnboardingGroupState,
    ) => {
      if (newData && oldData && newData.id !== oldData.id) {
        onOnboardingCompleted();
        const m = moment().add(2, 'hours');
        SettingsStore.setIgnoreOnboarding(m);
        // show old data (initial onboarding)
        return oldData;
      } else if (newData && newData.is_completed) {
        onOnboardingCompleted();
      }

      return newData;
    };
    const progressStore = useOnboardingProgress(updateState, false);

    const store = useLocalStore(() => ({
      showMenu: false,
      saving: false,
      showPicker() {
        if (!this.showMenu) {
          store.showMenu = true;
        } else {
          ref.current?.present();
        }
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
        }, 2000);
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
        onPress: () => {
          const done = progressStore.result?.steps.some(
            s => s.id === 'VerifyEmailStep' && s.is_completed,
          );
          if (!done) {
            navigation.navigate('VerifyEmail', {
              store: progressStore,
            });
          } else {
            showNotification(i18n.t('emailConfirm.alreadyConfirmed'));
          }
        },
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
        onPress: () => {
          if (hasVariation('mob-4472-in-app-verification')) {
            navigation.navigate('InAppVerification');
          } else {
            navigation.navigate('VerifyUniqueness', {
              mode: 'text',
            });
          }
        },
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

    const steps: (MenuItemProps | null)[] = progressStore.result
      ? progressStore.result.steps.map(s =>
          stepsMapping[s.id]
            ? {
                title: stepsMapping[s.id].title,
                icon: s.is_completed ? 'checkmark' : undefined,
                iconColor: s.is_completed ? 'Link' : undefined,
                onPress:
                  stepsMapping[s.id].onPress ||
                  (() =>
                    navigation.navigate(stepsMapping[s.id].screen, {
                      store: progressStore,
                    })),
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
              <MText
                style={[theme.fontXXL, theme.colorPrimaryText, theme.bold]}>
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
          {store.showMenu && (
            <BottomSheetModal ref={ref} autoShow>
              <BottomSheetButton
                action
                text={i18n.t('onboarding.hidePanel')}
                onPress={() => {
                  const m = moment().add(2, 'days');
                  SettingsStore.setIgnoreOnboarding(m);
                  store.hidePicker();
                  navigation.goBack();
                }}
              />
              <BottomSheetButton
                text={i18n.t('cancel')}
                onPress={store.hidePicker}
              />
            </BottomSheetModal>
          )}
          {steps.map((item, i) =>
            item ? (
              <MenuItem
                key={i}
                {...item}
                titleStyle={
                  [
                    item.iconColor
                      ? theme.colorSecondaryText
                      : theme.colorPrimaryText,
                    item.iconColor ? theme.strikeThrough : null,
                  ] as TextStyle
                }
                noBorderTop={i > 0}
              />
            ) : null,
          )}
        </>
      );

    return (
      <View style={[theme.bgPrimaryBackground, theme.flexContainer]}>
        <Topbar navigation={navigation} />
        {body}
      </View>
    );
  }),
  'OnboardingScreen',
);
