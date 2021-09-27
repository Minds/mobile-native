import React from 'react';

import { Text, Image, View } from 'react-native';

import { observer } from 'mobx-react';
import * as Progress from 'react-native-progress';

import updateService from '../common/services/update.service';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

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
          <Text style={styles.title}>
            {i18n.t('update.title', { version: updateService.version })}
          </Text>
          <Progress.Bar
            progress={updateService.progress / 100}
            width={null}
            color={ThemedStyles.getColor('Link')}
          />
          <Text style={styles.downloading}>
            {i18n.t('downloading')} {updateService.progress}%
          </Text>
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

export default UpdatingScreen;
