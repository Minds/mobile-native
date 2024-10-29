import React from 'react';

import { Image, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { observer } from 'mobx-react';

import MText from '~/common/components/MText';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import assets from '@assets';

import sp from '~/services/serviceProvider';

const UpdatingScreen = observer(() => {
  const i18n = sp.i18n;
  const updateService = sp.resolve('update');
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
            {i18n.t('update.title', { version: updateService.version })}
          </MText>
          <Progress.Bar
            progress={updateService.progress / 100}
            width={null}
            color={sp.styles.getColor('Link')}
          />
          <MText style={styles.downloading}>
            {i18n.t('downloading')} {updateService.progress}%
          </MText>
        </View>
      </View>
    </View>
  );
});

const styles = sp.styles.create({
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
