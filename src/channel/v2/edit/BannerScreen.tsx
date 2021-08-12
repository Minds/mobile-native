import React from 'react';
import ThemedStyles from '../../../styles/ThemedStyles';
import { observer } from 'mobx-react';
import { View, ImageBackground } from 'react-native';
import {
  BannerScreenRouteProp,
  BannerScreenNavigationProp,
} from '../../../navigation/NavigationTypes';
import { withErrorBoundary } from '../../../common/components/ErrorBoundary';
import SmallCircleButton from '../../../common/components/SmallCircleButton';
import * as Progress from 'react-native-progress';

type PropsType = {
  route: BannerScreenRouteProp;
  navigation: BannerScreenNavigationProp;
};

const BannerScreen = observer(({ route, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const store = route.params.store;
  const banner = store.channel?.getBannerSource();
  const inside = (
    <View style={styles.tapOverlayView}>
      {store.uploading && store.bannerProgress ? (
        <Progress.Pie progress={store.bannerProgress} size={36} />
      ) : (
        <SmallCircleButton
          name="camera"
          style={[styles.avatarSmallButton, theme.centered]}
          onPress={() => route.params.store.upload('banner')}
        />
      )}
    </View>
  );
  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      {banner ? (
        <ImageBackground
          source={store.channel?.getBannerSource()!}
          style={{ width: '100%', aspectRatio: 2.2 }}>
          {inside}
        </ImageBackground>
      ) : (
        <View />
      )}
    </View>
  );
});

export default withErrorBoundary(BannerScreen);

const styles = ThemedStyles.create({
  avatarSmallButton: {
    position: 'absolute',
    top: 60,
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
