import React from 'react';
import { CheckBox } from 'react-native-elements';
import { observer } from 'mobx-react';

import MText from '~/common/components/MText';
import { Screen } from '~/common/ui';
import sp from '~/services/serviceProvider';

const VideoSoundSettingsScreen = observer(() => {
  const theme = sp.styles.style;
  const videoPlayerService = sp.resolve('videoPlayer');
  const i18n = sp.i18n;
  return (
    <Screen>
      <MText
        style={[
          theme.paddingHorizontal4x,
          theme.paddingTop4x,
          theme.colorSecondaryText,
        ]}>
        {i18n.t('settings.backgroundsound.description')}
      </MText>
      <CheckBox
        title={i18n.t('settings.backgroundsound.enable')}
        containerStyle={[theme.checkbox, theme.marginLeft4x]}
        checked={videoPlayerService.backgroundSound}
        onPress={videoPlayerService.toggleBackgroundSound}
        textStyle={theme.colorPrimaryText}
      />
    </Screen>
  );
});

export default VideoSoundSettingsScreen;
