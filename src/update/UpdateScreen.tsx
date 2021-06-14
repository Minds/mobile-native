//@ts-nocheck
import React, { Component } from 'react';

import { Text, Image, View } from 'react-native';

import { observer } from 'mobx-react';
import * as Progress from 'react-native-progress';

import updateService from '../common/services/update.service';
import colors from '../styles/Colors';
import { ComponentsStyle } from '../styles/Components';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

@observer
export default class UpdatingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const theme = ThemedStyles.style;
    return (
      <View style={[theme.bgWhite, theme.padding, theme.flexContainer]}>
        <Text style={[theme.fontXXL, theme.textCenter, theme.padding]}>
          {i18n.t('update.title', { version: updateService.version })}
        </Text>
        <View style={[theme.centered, theme.flexContainer]}>
          <View>
            <Image
              resizeMode={'contain'}
              style={ComponentsStyle.logo}
              source={require('../assets/logos/logo.png')}
            />
            <Progress.Bar
              progress={updateService.progress / 100}
              width={null}
              color={colors.primary}
            />
            <Text
              style={[
                theme.fontM,
                theme.fontMedium,
                theme.textCenter,
                theme.colorDark,
                theme.marginTop,
              ]}>
              {i18n.t('downloading')} {updateService.progress}%
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
