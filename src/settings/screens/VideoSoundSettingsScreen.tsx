import React from 'react';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { CheckBox } from 'react-native-elements';
import { observer } from 'mobx-react';
import MText from '../../common/components/MText';
import { Screen } from '~/common/ui';
import videoPlayerService from '~/common/services/video-player.service';

const VideoSoundSettingsScreen = observer(() => {
  const theme = ThemedStyles.style;

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
