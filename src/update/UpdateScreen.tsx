import React from 'react';

import { Image, View } from 'react-native';

import { observer } from 'mobx-react';

import updateService from '../common/services/update.service';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import MText from '../common/components/MText';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

const UpdatingScreen = observer(() => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Image
          resizeMode={'contain'}
          style={styles.logo}
          source={require('../assets/logos/bulb.png')}
        />
        <View>
          <MText style={styles.title}>
            {i18n.t('update.title', { version: updateService.version })}
          </MText>
          <MText style={styles.downloading}>{i18n.t('downloading')}...</MText>
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

export default withErrorBoundaryScreen(UpdatingScreen, 'UpdatingScreen');
