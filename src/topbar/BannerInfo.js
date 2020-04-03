import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { CommonStyle as CS } from '../styles/Common';
import { observer, inject } from 'mobx-react';
import featuresService from '../common/services/features.service';

/**
 * Email Confirmation Message
 */
@inject('user')
@observer
class BannerInfo extends Component {
  /**
   * Dismiss message
   */
  dismissForLogged = () => {
    this.props.user.setDissmisBanner(true);
  };

  /**
   * Render
   */
  render() {
    const show =
      !this.props.user.bannerInfoDismiss && featuresService.has('radiocity');

    if (!show) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={[CS.fontS, CS.colorWhite, CS.textCenter]}>
          {'BREAKING: TICKETS ON SALE FOR "MINDS: FESTIVAL OF IDEAS"'}
        </Text>
        <Text
          style={[
            CS.fontS,
            CS.bold,
            CS.colorWhite,
            CS.paddingTop2x,
            CS.textCenter,
          ]}>
          {'@ RADIO CITY ON 6/13/2020. HELP US SELL OUT FAST!'}
        </Text>
        <Text
          style={[CS.fontS, styles.modalCloseIcon, CS.colorWhite, CS.bold]}
          onPress={this.dismissForLogged}>
          [Close]
        </Text>
      </View>
    );
  }
}

export default BannerInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4690df',
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 10,
  },

  body: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    alignSelf: 'flex-end',
    paddingRight: 15,
  },
});
