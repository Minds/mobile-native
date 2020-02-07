import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  I18nManager,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import DiscoveryUserNew from '../../discovery/DiscoveryUserNew';
import i18n from '../../common/services/i18n.service';

import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

@inject('discovery')
@observer
export default class SuggestedChannelsStepNew extends Component {

  constructor(props) {
    super(props);

    this.props.discovery.init();
    this.props.discovery.filters.setType('channels');
    this.props.discovery.filters.setPeriod('1y');
  }

  /**
   * Component did mount
   */
  componentDidMount() {

  }

  /**
   * Render user
   */
  renderUser = (user, index) => {
    return <DiscoveryUserNew
      row={{item: user}}
      key={user.guid}
      testID={`suggestedUser${index}`}
    />
  }

  getBody = () => {
    const discovery = this.props.discovery;

    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={styles.textsContainer}>
          <Text style={[CS.onboardingTitle, CS.marginBottom2x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <Text style={[CS.titleText, CS.colorPrimaryText]}>{i18n.t('onboarding.suggestedChannels')}</Text>
          <Text style={[CS.subTitleText, CS.colorSecondaryText]}>{i18n.t('onboarding.step',{step: 4, total: 4})}</Text>
          <Text style={[
            CS.subTitleText,
            CS.colorPrimaryText,
            CS.marginBottom4x,
            CS.marginTop4x
          ]}>{i18n.t('onboarding.suggestedChannelsDescription')}</Text>
        </View>
        <ScrollView style={styles.channelContainer}>
        {!discovery.listStore.loaded && <ActivityIndicator />}
        {discovery.listStore.entities.slice().map((user, i) => this.renderUser(user, i))}
        </ScrollView>
      </View>
    );
  }

  getFooter = () => {
    return <OnboardingButtons onNext={this.props.onNext} />;
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CS.flexContainerCenter]}>
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
  channelContainer: {
    width: '100%',
  },
  textsContainer: {
    alignItems: 'center',
  },
});