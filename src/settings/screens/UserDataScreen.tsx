import React, { useCallback } from 'react';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { CheckBox } from 'react-native-elements';
import { observer } from 'mobx-react';
import MText from '../../common/components/MText';
import { Screen } from '~/common/ui';
import mindsConfigService from '~/common/services/minds-config.service';
import analyticsService from '~/common/services/analytics.service';
import settingsService from '../SettingsService';
import { showNotification } from 'AppMessages';
import { View } from 'react-native';
import { Button } from '@minds/ui';
import { useDeletePostHogPersonMutation } from '~/graphql/api';

const UserDataScreen = observer(() => {
  const theme = ThemedStyles.style;

  const { mutateAsync: deleteDataFn } = useDeletePostHogPersonMutation();

  const isOptOut = () => mindsConfigService.settings?.posthog?.opt_out;

  const toggleOptOut = useCallback(() => {
    analyticsService.setOptOut(!isOptOut());

    try {
      settingsService.submitSettings({
        opt_out_analytics: isOptOut(),
      });
      showNotification(i18n.t('settings.saved'), 'info');
    } catch (err) {
      showNotification(i18n.t('errorMessage'));
      console.error(err);
    }
  }, []);

  const deleteData = async () => {
    try {
      await deleteDataFn({});
      showNotification(i18n.t('settings.userData.deletedSuccess'), 'success');
    } catch (err) {
      showNotification(i18n.t('settings.userData.deletedError'), 'warning');
      console.log(err);
    }
  };

  return (
    <Screen scroll>
      <MText
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.colorSecondaryText,
        ]}>
        Your user data consists of two primary categories of data:
      </MText>
      <MText
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.colorSecondaryText,
        ]}>
        (1) A record of your public contributions to the network, including your
        public profile, posts, media uploads, and votes. These are stored
        indefinitely (or until you remove them) so that they are available to
        you and other public users of the app.
      </MText>
      <MText
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.colorSecondaryText,
        ]}>
        (2) Observational analytics, including which pages and posts you've
        seen, which buttons you've clicked on, and contextual information like
        which browser you're using, and where you came from. Observational
        analytics are used internally and allow us to reduce spam, diagnose
        problems with the app, and understand how to improve the service. They
        also allow us to enhance your experience, e.g. by recommending only
        posts that you haven't already seen before.
      </MText>
      <MText
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.colorSecondaryText,
        ]}>
        Observational analytics are not shared with outside companies for
        tracking purposes. Moreover, we offer you the transparency to download
        your personal analytics (coming soon) to see what's collected, and
        optionally opt-out of collection if you prefer.
      </MText>

      <MText
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.colorSecondaryText,
        ]}>
        <MText
          style={[
            theme.paddingHorizontal4x,
            theme.paddingTop4x,
            theme.colorAlert,
          ]}>
          Note:&nbsp;
        </MText>
        By opting out of observational analytics, you may see recommendations
        for posts you've already seen. And because observational analytics allow
        us to detect spam engagements, opting out means that your app
        engagements will not contribute to trending rankings and engagement
        rewards.
      </MText>

      <CheckBox
        title={i18n.t('settings.userData.optOut')}
        containerStyle={[theme.checkbox, theme.marginLeft4x]}
        checked={isOptOut()}
        onPress={toggleOptOut}
        textStyle={theme.colorPrimaryText}
      />

      <MText
        style={[
          theme.fontXL,
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.colorSecondaryText,
        ]}>
        User data transparency
      </MText>
      <MText
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.paddingBottom4x,
          theme.colorSecondaryText,
        ]}>
        It's important to us that you're in control of your user data. If you
        wish to delete the observational data, you may do so below.
      </MText>

      <View
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.paddingBottom8x,
        ]}>
        <Button top="XXL" onPress={deleteData} type="warning">
          {i18n.t('settings.deleteChannelButton')}
        </Button>
      </View>
    </Screen>
  );
});

export default UserDataScreen;
