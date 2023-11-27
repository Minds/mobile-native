import React, { useCallback } from 'react';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { CheckBox } from 'react-native-elements';
import { observer } from 'mobx-react';
import sessionService from '../../common/services/session.service';
import MText from '../../common/components/MText';
import { Screen } from '~/common/ui';

const AutoplaySettingsScreen = observer(() => {
  const theme = ThemedStyles.style;
  const user = sessionService.getUser();

  const toggleDisabled = useCallback(() => {
    user.toggleDisableAutoplayVideos();
  }, [user]);

  return (
    <Screen>
      <MText
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.colorSecondaryText,
        ]}>
        {i18n.t('settings.autoplay.description')}
      </MText>
      <CheckBox
        title={i18n.t('settings.autoplay.enable')}
        containerStyle={[theme.checkbox, theme.marginLeft4x]}
        checked={!user.disable_autoplay_videos}
        onPress={toggleDisabled}
        textStyle={theme.colorPrimaryText}
      />
    </Screen>
  );
});

export default AutoplaySettingsScreen;
