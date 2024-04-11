import React from 'react';

import { Image, View } from 'react-native';
// import * as Progress from 'react-native-progress';
import { observer } from 'mobx-react';

// import updateService from '~/common/services/update.service';
// import i18n from '~/common/services/i18n.service';
import MText from '~/common/components/MText';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import assets from '@assets';
import ThemedStyles from '../styles/ThemedStyles';
import { Button } from '~/common/ui';
import { Linking } from 'react-native';
import NavigationService from '~/navigation/NavigationService';

export const UpdateScreen = observer(props => {
  const { href } = props.route?.params ?? {};
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Image
          resizeMode={'contain'}
          style={styles.logo}
          source={assets.LOGO_SQUARED}
        />
        <View>
          <MText style={styles.title}>
            This update requires manual installation
            {/* {i18n.t('update.title', { version: updateService.version })} */}
          </MText>
          {/* <Progress.Bar
            progress={updateService.progress / 100}
            width={null}
            color={ThemedStyles.getColor('Link')}
          /> */}
          <MText style={styles.downloading}>
            After downloading, open the APK to install the update
            {/* {i18n.t('downloading')} {updateService.progress}% */}
          </MText>
          <Button
            top="XL"
            mode="solid"
            type="action"
            onPress={() => {
              Linking.openURL(href);
            }}>
            Download
          </Button>
          <Button
            mode="solid"
            top="L"
            onPress={() => {
              NavigationService.goBack();
            }}>
            Cancel
          </Button>
        </View>
      </View>
    </View>
  );
});

const styles = ThemedStyles.create({
  mainContainer: [
    'flexContainer',
    'bgSecondaryBackground',
    'alignCenter',
    'justifyCenter',
  ],
  title: ['fontXXL', 'textCenter', 'paddingVertical3x'],
  container: [
    'centered',
    'padding5x',
    'borderRadius14x',
    'bgPrimaryBackground',
  ],
  logo: { width: 80, height: 90 },
  downloading: [
    'fontM',
    'fontMedium',
    'textCenter',
    'colorPrimaryText',
    'marginTop2x',
  ],
});

export default withErrorBoundaryScreen(UpdateScreen, 'UpdateScreen');
