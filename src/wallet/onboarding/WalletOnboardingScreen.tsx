import React, { Component } from 'react';

import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { inject, observer } from 'mobx-react';

import WalletOnboardingWelcomeScreen from './screens/WalletOnboardingWelcomeScreen';
import WalletOnboardingJoinRewardsScreen from './screens/WalletOnboardingJoinRewardsScreen';
import WalletOnboardingOnChainSetupScreen from './screens/WalletOnboardingOnChainSetupScreen';
import WalletOnboardingFinishedScreen from './screens/WalletOnboardingFinishedScreen';

import stylesheet from '../../onboarding/stylesheet';
import { CommonStyle as CS } from '../../styles/Common';

@inject('user', 'wallet')
@observer
class WalletOnboardingScreen extends Component {
  /**
   * State
   */
  state = {
    step: 0,
  };

  componentDidMount() {
    this.props.wallet.setOnboardingShown(true);
  }

  setNavNext = next => {
    this.props.navigation.setOptions({
      title: 'Wallet',
      headerRight: () => next,
    });
  };

  nextStepAction = async () => {
    switch (this.state.step) {
      case 0:
        if (!this.props.user.hasRewards()) {
          this.setState({ step: 1 });
          break;
        }
      /* no break on purpose */

      case 1:
        if (!this.props.user.hasEthWallet()) {
          this.setState({ step: 2 });
          break;
        }
      /* no break on purpose */

      case 2:
        this.setState({ step: 3 });
        break;

      case 3:
        await this.props.wallet.setOnboardingComplete(true);

        if (this.props.route.params && this.props.route.params.next) {
          this.props.navigation.replace('ReplaceCurrentScreen');
        } else {
          this.props.navigation.goBack();
        }
        return;
    }

    this.setNavNext(null);
  };

  render() {
    return (
      <ScrollView style={style.view} keyboardShouldPersistTaps="always">
        {this.state.step === 0 && (
          <WalletOnboardingWelcomeScreen
            onNext={this.nextStepAction}
            onSetNavNext={this.setNavNext}
          />
        )}

        {this.state.step === 1 && (
          <WalletOnboardingJoinRewardsScreen
            onNext={this.nextStepAction}
            onSetNavNext={this.setNavNext}
          />
        )}

        {this.state.step === 2 && (
          <WalletOnboardingOnChainSetupScreen
            onNext={this.nextStepAction}
            onSetNavNext={this.setNavNext}
          />
        )}

        {this.state.step === 3 && (
          <WalletOnboardingFinishedScreen
            onNext={this.nextStepAction}
            onSetNavNext={this.setNavNext}
          />
        )}
      </ScrollView>
    );
  }
}

export default WalletOnboardingScreen;

const style = StyleSheet.create(stylesheet);
