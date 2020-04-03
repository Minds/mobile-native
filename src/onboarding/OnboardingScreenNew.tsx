//@ts-nocheck
import React, { Component } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
  SafeAreaView,
} from 'react-native';

import { inject, observer } from 'mobx-react';

import Wizard from '../common/components/Wizard';

import WelcomeStepNew from './steps/WelcomeStepNew';
import navigationService from '../navigation/NavigationService';
import i18nService from '../common/services/i18n.service';
import CenteredLoading from '../common/components/CenteredLoading';
import HashtagsStepNew from './steps/HashtagsStepNew';
import ChannelSetupStepNew from './steps/ChannelSetupStepNew';
import ThemedStyles from '../styles/ThemedStyles';

@inject('onboarding', 'hashtag', 'groupsBar', 'discovery')
@observer
class OnboardingScreenNew extends Component {
  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null,
  };

  /**
   * Component did mount
   */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  /**
   * On hardware back press
   */
  onBackPress = () => {
    this.wizard.previous();
    return true;
  };

  onFinish = async () => {
    try {
      await this.props.onboarding.setShown(true);
      //await this.props.onboarding.getProgress();
      this.props.hashtag.setAll(false);
      await this.loadJoinedGroups();
      await this.clearDiscovery();
      navigationService.navigate('Tabs');
    } catch (err) {
      Alert.alert(
        i18nService.t('error'),
        i18n.t('errorMessage') + '\n' + i18n.t('tryAgain'),
      );
    }
  };

  /**
   * Load the groups user joined on suggested groups step
   */
  loadJoinedGroups = async () => {
    this.props.groupsBar.reset();
    await this.props.groupsBar.loadGroups();
    await this.props.groupsBar.loadMarkers();
  };

  /**
   * Clear discovery used for suggested groups and channels
   */
  clearDiscovery = async () => {
    this.props.discovery.clearList();
    this.props.discovery.reset();
  };

  handleWizarRef = ref => {
    this.wizard = ref;
  };

  onNext = () => this.wizard.next();

  onBack = () => this.wizard.previous();

  render() {
    const CS = ThemedStyles.style;
    const steps = [];
    if (!this.props.onboarding.progress) {
      return <CenteredLoading />;
    }
    const completed_items = []; //this.props.onboarding.progress.completed_items;

    if (!completed_items.some(r => r == 'creator_frequency')) {
      steps.push({
        component: (
          <WelcomeStepNew onNext={this.onNext} onFinish={this.onFinish} />
        ),
        ready: () => false,
      });
    }

    if (!completed_items.some(r => r == 'suggested_hashtags')) {
      steps.push({
        component: (
          <HashtagsStepNew onNext={this.onNext} onBack={this.onBack} />
        ),
      });
    }

    if (!completed_items.some(r => r == 'tokens_verification')) {
      steps.push({
        component: (
          <ChannelSetupStepNew
            ref={r => (this.channelSetup = r)}
            onNext={this.onNext}
            onBack={this.onBack}
          />
        ),
      });
    }

    // TODO: enable group and channel selectors
    // if (!completed_items.some(r => r == 'suggested_groups')) {
    //   steps.push({component: <SuggestedGroupsStepNew onNext={this.onNext} onBack={this.onBack}/>});
    // }

    // if (!completed_items.some(r => r == 'suggested_channels')) {
    //   steps.push({component: <SuggestedChannelsStepNew onNext={this.onNext} onBack={this.onBack}/>});
    // }

    return (
      <SafeAreaView style={[CS.flexContainer, CS.backgroundPrimary]}>
        <KeyboardAvoidingView
          style={[CS.flexContainer]}
          behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <Wizard
            steps={steps}
            onFinish={this.onFinish}
            ref={this.handleWizarRef}></Wizard>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default OnboardingScreenNew;
