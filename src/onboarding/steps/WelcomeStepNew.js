import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import i18nService from '../../common/services/i18n.service';
import { ComponentsStyle } from '../../styles/Components';
import Button from '../../common/components/Button';

@inject('user')
@observer
export default class WelcomeStep extends Component {

  getBody = () => {
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <Image
          source={require('./../../assets/welcome.png')}
          style={[styles.welcome, CS.marginTop4x, CS.marginBottom3x]}
        />
        <Text style={[
          CS.titleText,
          CS.colorPrimaryText,
          CS.marginBottom4x
        ]}>@{this.props.user.me.name}</Text>

        <Text style={[
          CS.subTitleText,
          CS.colorSecondaryText,
          CS.marginBottom4x
        ]}>{i18nService.t('onboarding.welcomeNew')}</Text>

        <Text style={[
          CS.subTitleText,
          CS.colorSecondaryText,
          CS.marginBottom4x
        ]}>{i18nService.t('onboarding.welcomePrivacy')}</Text>
      </View>
    );
  };

  getFooter = () => {
    return (
      <View style={CS.flexContainer}>
        <Button
          onPress={this.props.onNext}
          borderRadius={2}
          containerStyle={ComponentsStyle.loginButtonNew}
          testID="wizardNext"
        >
          <Text style={ComponentsStyle.loginButtonTextNew}>{i18nService.t('onboarding.welcomeSetup')}</Text>
        </Button>
         <Text style={[CS.linkNew, CS.marginTop2x, CS.centered]} onPress={ this.props.onFinish }>{i18nService.t('onboarding.welcomeLater')}</Text>
      </View>
    )
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CS.flexContainerCenter]} testID="artTestID">
        <View style={[CS.mindsLayoutBody, CS.backgroundPrimary]}>
          {this.getBody()}
        </View>
        <View style={[CS.mindsLayoutFooter, CS.backgroundPrimary]}>
          {this.getFooter()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    height: 36,
    width: 36,
  }
});
