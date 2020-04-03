//@ts-nocheck
//@ts-nocheck
import React, {
  Component
} from 'react';

import {
  View,
  Text,
  Linking,
  StyleSheet,
} from 'react-native';

import TransparentButton from '../../../common/components/TransparentButton';
import NavNextButton from '../../../common/components/NavNextButton';

import Colors from '../../../styles/Colors';

import stylesheet from '../../../onboarding/stylesheet';
import i18n from '../../../common/services/i18n.service';

export default class WalletOnboardingFinishedScreen extends Component {
  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
  }

  getNextButton = () => {
    return (
      <NavNextButton
        onPress={this.props.onNext}
        title={i18n.t('continue').toUpperCase()}
        color={Colors.primary}
      />
    );
  }

  render() {
    return (
      <View>
        <Text style={style.h1}>{i18n.t('onboarding.yourAreReady')}</Text>

        <Text style={style.p}>
          {i18n.t('onboarding.readyDescription1')}
        </Text>

        <Text style={style.p}>
          {i18n.t('onboarding.readyDescription2', null, {tokens:<Text style={style.b}>Tokens 101</Text>})}
        </Text>

        <View style={style.vertButtonBar}>
          <TransparentButton
            style={style.vertButton}
            onPress={() => {Linking.openURL('https://www.minds.com/wallet/tokens/101')}}
            title={i18n.t('onboarding.moreOnRewards')}
            color={Colors.darkGreyed}
          />

          <TransparentButton
            style={style.vertButton}
            onPress={() => {Linking.openURL('https://www.minds.com/faq/wire')}}
            title={i18n.t('onboarding.moreAboutWire')}
            color={Colors.darkGreyed}
          />

          <TransparentButton
            style={style.vertButton}
            onPress={() => {Linking.openURL('https://www.minds.com/faq/boost')}}
            title={i18n.t('onboarding.moreAboutBoost')}
            color={Colors.darkGreyed}
          />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
