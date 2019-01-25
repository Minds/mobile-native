import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  StackActions,
  NavigationActions
} from 'react-navigation';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  inject,
  observer
} from 'mobx-react/native'

import WalletOnboardingJoinRewardsScreen from '../wallet/onboarding/screens/WalletOnboardingJoinRewardsScreen';
import MessengerOnboardingScreen from '../messenger/MessengerOnboardingScreen';
import isIphoneX from '../common/helpers/isIphoneX';
import stylesheet from './stylesheet';

const headerStyle = isIphoneX() ? {paddingTop: 40} : {};

@inject('user', 'wallet')
@observer
export default class OnboardingScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={[style.header, headerStyle]}>
        <View></View>

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
    step: 1
  }

  setNavNext = next => {
    this.props.navigation.setParams({ nextButton: next })
  }

  nextStepAction = async () => {
    switch (this.state.step) {
      case 1:
        this.setState({ step: 2 });
        break;
      case 2:
        this.goToTabs();
    }

    this.setNavNext(null);
  };

  goToTabs() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Tabs' })
      ]
    })

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <ScrollView style={style.view} keyboardShouldPersistTaps='always'>

        {this.state.step === 1 && <WalletOnboardingJoinRewardsScreen
          onNext={this.nextStepAction}
          onSetNavNext={this.setNavNext}
        />}

        {this.state.step === 2 && <MessengerOnboardingScreen
          onNext={this.nextStepAction}
          onSetNavNext={this.setNavNext}
        />}

      </ScrollView>
    );
  }
}

const style = StyleSheet.create(stylesheet);
