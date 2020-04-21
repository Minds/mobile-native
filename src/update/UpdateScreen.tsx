//@ts-nocheck
import React, { Component } from 'react';

import { Button, Text, Image, TextInput, StyleSheet, View } from 'react-native';

import { observer } from 'mobx-react';
import * as Progress from 'react-native-progress';

import { CommonStyle as CS } from '../styles/Common';
import updateService from '../common/services/update.service';
import colors from '../styles/Colors';
import { ComponentsStyle } from '../styles/Components';
import i18n from '../common/services/i18n.service';

@observer
export default class UpdatingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={[CS.backgroundWhite, CS.padding, CS.flexContainer]}>
        <Text style={[CS.fontXXL, CS.textCenter, CS.padding]}>
          {i18n.t('update.title', { version: updateService.version })}
        </Text>
        <View style={[CS.centered, CS.flexContainer]}>
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
                CS.fontM,
                CS.fontMedium,
                CS.textCenter,
                CS.colorDark,
                CS.marginTop,
              ]}>
              {i18n.t('downloading')} {updateService.progress}%
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
