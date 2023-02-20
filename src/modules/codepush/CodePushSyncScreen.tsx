import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import React from 'react';
import * as Progress from 'react-native-progress';
import ThemedStyles from '~/styles/ThemedStyles';
import { Column, H2, Screen } from '../../common/ui';
import codePushStore from './codepush.store';

function CodePushSyncScreen() {
  return (
    <Screen safe>
      <Column top="XXXL2">
        <H2 align="center" bottom="XL">
          Syncing app bundle
        </H2>
        <Progress.Bar
          progress={codePushStore.downloadProgress}
          color={ThemedStyles.getColor('Link')}
          width={null}
          height={10}
          useNativeDriver={true}
          style={[
            ThemedStyles.style.marginHorizontal4x,
            ThemedStyles.style.marginBottom,
          ]}
        />
      </Column>
      <LottieView
        autoPlay={true}
        resizeMode="contain"
        style={ThemedStyles.style.flexContainer}
        source={require('../../assets/animations/multi-cube.json')}
        loop={true}
        enableMergePathsAndroidForKitKatAndAbove
        speed={1}
      />
    </Screen>
  );
}

export default observer(CodePushSyncScreen);
