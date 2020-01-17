import React, { Component } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import i18n from '../common/services/i18n.service';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { CommonStyle as CS } from '../styles/Common';
import { observer, inject } from 'mobx-react/native';
import featuresService from '../common/services/features.service';

/**
 * Email Confirmation Message
 */
export default
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
      !this.props.user.bannerInfoDismiss &&
      (!this.props.logged || featuresService.has('radiocity'));

    if (!show) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={[CS.fontM, CS.colorWhite]}>
          {"BREAKING: TICKETS ON SALE FOR \"MINDS: FESTIVAL OF IDEAS\""}
        </Text>
        <Text style={[CS.bold, CS.colorWhite]}>
          {"@ RADIO CITY ON 6/13/2020. HELP US SELL OUT FAST!"}
        </Text>
        <IonIcon
          style={[styles.modalCloseIcon, CS.colorWhite]}
          size={28}
          name="ios-close"
          onPress={this.dismissForLogged}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4690df',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  modalCloseIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 15,
  },
});
