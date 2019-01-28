import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  inject,
  observer
} from 'mobx-react/native'

import WalletOnboardingWelcomeScreen from './screens/WalletOnboardingWelcomeScreen';
import WalletOnboardingJoinRewardsScreen from './screens/WalletOnboardingJoinRewardsScreen';
import WalletOnboardingOnChainSetupScreen from './screens/WalletOnboardingOnChainSetupScreen';
import WalletOnboardingFinishedScreen from './screens/WalletOnboardingFinishedScreen';

import isIphoneX from '../../common/helpers/isIphoneX';
import stylesheet from '../../onboarding/stylesheet';

const headerStyle = isIphoneX() ? {paddingTop: 40} : {};

@inject('user', 'wallet')
@observer
export default class WalletOnboardingScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={[style.header, headerStyle]}>
        <Icon size={28} name="ios-close" onPress={() => navigation.goBack()} />

        <View>
          {(navigation.state.params && navigation.state.params.nextButton) && navigation.state.params.nextButton}
        </View>
      </View>
    ),
    transitionConfig: {
      isModal: true
    },
  });

  state = {
    step: 0
  }

  componentDidMount() {
    this.props.wallet.setOnboardingShown(true);
  }

  setNavNext = next => {
    this.props.navigation.setParams({ nextButton: next })
  }

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

        if (this.props.navigation.state.params && this.props.navigation.state.params.next) {
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
      <ScrollView style={style.view} keyboardShouldPersistTaps='always'>
        {this.state.step === 0 && <WalletOnboardingWelcomeScreen
          onNext={this.nextStepAction}
          onSetNavNext={this.setNavNext}
        />}

        {this.state.step === 1 && <WalletOnboardingJoinRewardsScreen
          onNext={this.nextStepAction}
          onSetNavNext={this.setNavNext}
        />}

        {this.state.step === 2 && <WalletOnboardingOnChainSetupScreen
          onNext={this.nextStepAction}
          onSetNavNext={this.setNavNext}
        />}

        {this.state.step === 3 && <WalletOnboardingFinishedScreen
          onNext={this.nextStepAction}
          onSetNavNext={this.setNavNext}
        />}
      </ScrollView>
    );
  }
}

const style = StyleSheet.create(stylesheet);
