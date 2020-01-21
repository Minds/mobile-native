import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import GroupsListItemNew from '../../groups/GroupsListItemNew';
import i18n from '../../common/services/i18n.service';

import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

@inject('discovery')
@observer
export default class SuggestedGroupsStepNew extends Component {

  constructor(props) {
    super(props);

    this.props.discovery.init();
  }
  
  componentDidMount() {
    this.props.discovery.filters.setType('groups');
    this.props.discovery.filters.setPeriod('30d');
  }

  renderGroup = (group, i) => {
    return  <GroupsListItemNew key={group.guid} group={group} index={i} />
  }

  getBody = () => {
    const discovery = this.props.discovery;

    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={styles.textsContainer}>
          <Text style={[CS.onboardingTitle, CS.marginBottom2x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <Text style={[CS.titleText, CS.colorPrimaryText]}>{i18n.t('onboarding.groupTitle')}</Text>
          <Text style={[CS.subTitleText, CS.colorSecondaryText]}>{i18n.t('onboarding.step',{step: 3, total: 4})}</Text>
          <Text style={[
            CS.subTitleText,
            CS.colorPrimaryText,
            CS.marginBottom4x,
            CS.marginTop4x
          ]}>{i18n.t('onboarding.suggestedGroupsDescription')}</Text>
        </View>
        <ScrollView style={styles.groupContainer}>
          {!discovery.listStore.loaded && <ActivityIndicator />}
          {discovery.listStore.entities.slice().map((group, i) => this.renderGroup(group, i))}
        </ScrollView>
      </View>
    );
  };

  getFooter = () => {
    return <OnboardingButtons onNext={this.props.onNext} />;
  };

  render() {
    return (
      <View style={[CS.flexContainerCenter]}>
        <View style={[CS.mindsLayoutBody, CS.backgroundThemePrimary]}>
          {this.getBody()}
        </View>
        <View style={[CS.mindsLayoutFooter, CS.backgroundThemePrimary]}>
          {this.getFooter()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  groupContainer: {
    width: '100%',
  },
  textsContainer: {
    alignItems: 'center',
  },
});