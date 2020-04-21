//@ts-nocheck
//@ts-nocheck
import React, { Component } from 'react';

import { View, Text, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import TransparentButton from '../../../common/components/TransparentButton';
import NavNextButton from '../../../common/components/NavNextButton';

import Colors from '../../../styles/Colors';

import stylesheet from '../../../onboarding/stylesheet';
import i18n from '../../../common/services/i18n.service';

export default class WalletOnboardingWelcomeScreen extends Component {
  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
  }

  getNextButton = () => {
    return (
      <NavNextButton
        onPress={this.props.onNext}
        title="NEXT"
        color={Colors.primary}
      />
    );
  };

  render() {
    return (
      <View>
        <Text style={style.h1}>{i18n.t('onboarding.welcomToWallet')}</Text>

        <Text style={style.p}>{i18n.t('onboarding.tokensDescription')}</Text>

        <View style={style.rows}>
          <View style={[style.row, style.rowFirst]}>
            <Icon style={style.loneIcon} name="check-circle" size={40} />
            <Text style={style.h2}>{i18n.t('onchain')}</Text>

            <Text style={style.legend}>
              {i18n.t('onboarding.onchainDescription')}
            </Text>
          </View>

          <View style={style.row}>
            <Icon style={style.loneIcon} name="donut-large" size={40} />
            <Text style={style.h2}>{i18n.t('blockchain.offchain')}</Text>

            <Text style={style.legend}>
              {i18n.t('onboarding.offchainDescription')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
