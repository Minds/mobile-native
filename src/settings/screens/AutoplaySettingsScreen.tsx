import React, { useCallback } from 'react';
import { CheckBox } from 'react-native-elements';
import { observer } from 'mobx-react';

import MText from '~/common/components/MText';
import { Screen } from '~/common/ui';
import sp from '~/services/serviceProvider';

const AutoplaySettingsScreen = observer(() => {
  const theme = sp.styles.style;
  const user = sp.session.getUser();
  const i18n = sp.i18n;

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
