//@ts-nocheck
import React, { Component } from 'react';

import { View, Text, StyleSheet, Linking } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import stylesheet from './stylesheet';
import Touchable from '../common/components/Touchable';
import i18n from '../common/services/i18n.service';

export default class NotSupportedScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <CIcon name="bank" size={24} color={tintColor} />
    ),
    header: (
      <View style={style.header}>
        <Icon
          style={style.close}
          size={28}
          name="ios-close"
          onPress={() => navigation.goBack()}
        />
      </View>
    ),
    transitionConfig: {
      isModal: true,
    },
  });

  moreInfoUrl = 'https://www.minds.com/faq';

  moreInfoAction = () => {
    Linking.openURL(this.moreInfoUrl);
  };

  render() {
    return (
      <View style={style.view}>
        <Text style={style.text}>{i18n.t('comingSoon.notSupported')}</Text>

        <Touchable onPress={this.moreInfoAction}>
          <Text style={[style.text, style.smaller, style.link]}>
            {i18n.t('comingSoon.moreInformation') + '\n'}
            {this.moreInfoUrl}
          </Text>
        </Touchable>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
