import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { CheckBox } from 'react-native-elements';
import { observer } from 'mobx-react';
import sessionService from '../../common/services/session.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AutoplaySettingsScreen = observer(() => {
  const theme = ThemedStyles.style;
  const user = sessionService.getUser();

  const toggleDisabled = useCallback(() => {
    user.toggleDisableAutoplayVideos();
  }, [user]);

  const insets = useSafeAreaInsets();
  const cleanTop = { paddingTop: insets.top };

  return (
    <View style={[theme.padding4x, cleanTop]}>
      <Text style={[theme.colorSecondaryText, theme.marginBottom3x]}>
        {i18n.t('settings.autoplay.description')}
      </Text>
      <CheckBox
        title={i18n.t('settings.autoplay.enable')}
        containerStyle={[theme.checkbox]}
        checked={!user.disable_autoplay_videos}
        onPress={toggleDisabled}
        textStyle={theme.colorPrimaryText}
      />
    </View>
  );
});

export default AutoplaySettingsScreen;
