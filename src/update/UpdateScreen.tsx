import React from 'react';

import { Text, Image, View } from 'react-native';

import { observer } from 'mobx-react';
import * as Progress from 'react-native-progress';

import updateService from '../common/services/update.service';
import { ComponentsStyle } from '../styles/Components';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

const UpdatingScreen = observer(() => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>
        {i18n.t('update.title', { version: updateService.version })}
      </Text>
      <View style={styles.container}>
        <View>
          <Image
            resizeMode={'contain'}
            style={ComponentsStyle.logo}
            source={require('../assets/logos/logo.png')}
          />
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
  mainContainer: ['bgPrimaryBackground', 'padding', 'flexContainer'],
  title: ['fontXXL', 'textCenter', 'padding'],
  container: ['centered', 'flexContainer'],
  downloading: [
    'fontM',
    'fontMedium',
    'textCenter',
    'colorPrimaryText',
    'marginTop',
  ],
});

export default UpdatingScreen;
