import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  inject,
  observer
} from 'mobx-react/native'

// import WalletOnboardingJoinRewardsScreen from '../wallet/onboarding/screens/WalletOnboardingJoinRewardsScreen';
import isIphoneX from '../common/helpers/isIphoneX';
import Wizard from '../common/components/Wizard';
import HashtagsStep from './steps/HashtagsStep';
import SuggestedChannelsStep from './steps/SuggestedChannelsStep';
import SuggestedGroupsStep from './steps/SuggestedGroupsStep';
import ChannelSetupStep from './steps/ChannelSetupStep';
import RewardsStep from './steps/RewardsStep';
import WelcomeStep from './steps/WelcomeStep';
import { CommonStyle as CS } from '../styles/Common';
import navigationService from '../navigation/NavigationService';

const headerStyle = isIphoneX() ? {paddingTop: 40} : {};

@observer
@inject('onboarding', 'hashtag')
export default class OnboardingScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  onFinish = async () => {
    try {
      await this.props.onboarding.setShown(true);
      await this.props.onboarding.getProgress();
      this.props.hashtag.setAll(false);
      navigationService.reset('Tabs');
    } catch (err) {
      Alert.alert('Error', 'Oops! There was an error.\nPlease try again.')
    }
  }

  handleWizarRef = (ref) => {
    this.wizard = ref;
  }

  render() {
    const steps = [];
    const completed_items = this.props.onboarding.progress.completed_items;

    if (!completed_items.some(r => r == 'creator_frequency')) {
      steps.push({component: <WelcomeStep onNext={() => this.wizard.next()}/>, ready: () => false});
    }
    if (!completed_items.some(r => r == 'suggested_hashtags')) {
      steps.push({component: <HashtagsStep/>});
    }
    if (!completed_items.some(r => r == 'suggested_channels')) {
      steps.push({component: <SuggestedChannelsStep/>});
    }
    if (!completed_items.some(r => r == 'suggested_groups')) {
      // steps.push({component: <SuggestedGroupsStep/>});
    }

    steps.push({
      component: <ChannelSetupStep ref={r => this.channelSetup = r}/>,
      onNext: async() => {
        return await this.channelSetup.wrappedInstance.save();
      }
    });

    if (!completed_items.some(r => r == 'tokens_verification')) {
      steps.push({component: <RewardsStep onJoin={() => this.wizard.next()}/>});
    }

    return (
      <KeyboardAvoidingView style={[headerStyle, CS.flexContainer, CS.backgroundWhite]} behavior={ Platform.OS == 'ios' ? 'padding' : null }>
        <Wizard steps={steps} onFinish={this.onFinish} ref={this.handleWizarRef}></Wizard>
      </KeyboardAvoidingView>
    );
  }
}

// const style = StyleSheet.create(stylesheet);
