//@ts-nocheck
import React, { Component } from 'react';

import { View, Text } from 'react-native';

import { CommonStyle as CS } from '../../styles/Common';
import i18n from '../../common/services/i18n.service';

export default class AllDoneStep extends Component {
  /**
   * Component did mount
   */
  componentDidMount() {
    setTimeout(this.props.onNext, 1500);
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CS.flexContainerCenter, CS.backgroundPrimary, CS.centered]}>
        <Text style={[CS.onboardingTitle]}>{i18n.t('boosts.tabNewsfeed')}</Text>
      </View>
    );
  }
}
