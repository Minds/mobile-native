import React from 'react';
import ThemedStyles from '../../../styles/ThemedStyles';
import { observer } from 'mobx-react';
import { View, ImageBackground } from 'react-native';
import {
  AvatarScreenRouteProp,
  AvatarScreenNavigationProp,
} from '../../../navigation/NavigationTypes';
import { withErrorBoundary } from '../../../common/components/ErrorBoundary';
import SmallCircleButton from '../../../common/components/SmallCircleButton';
import * as Progress from 'react-native-progress';

type PropsType = {
  route: AvatarScreenRouteProp;
  navigation: AvatarScreenNavigationProp;
};

const AvatarScreen = observer(({ route, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const store = route.params.store;
  const Avatar = store.channel?.getAvatarSource();
  const inside = (
    <View style={styles.tapOverlayView}>
      {store.uploading && store.avatarProgress ? (
        <Progress.Pie progress={store.avatarProgress} size={36} />
      ) : (
        <SmallCircleButton
          name="camera"
          style={[styles.avatarSmallButton, theme.centered]}
          onPress={() => route.params.store.upload('avatar')}
        />
      )}
    </View>
  );
  return (
    <View
      style={[
        theme.flexContainer,
        theme.bgPrimaryBackground,
        theme.paddingTop2x,
        theme.alignCenter,
      ]}>
      {Avatar ? (
        <ImageBackground
          source={store.channel?.getAvatarSource()!}
          style={{
            width: 150,
            aspectRatio: 1,
            borderRadius: 100,
            overflow: 'hidden',
          }}>
          {inside}
        </ImageBackground>
      ) : (
        <View />
      )}
    </View>
  );
});

export default withErrorBoundary(AvatarScreen);

const styles = ThemedStyles.create({
  avatarSmallButton: {
    position: 'absolute',
    top: 50,
  },
  tapOverlayView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
