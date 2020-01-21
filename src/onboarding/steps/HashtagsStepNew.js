import React, { Component } from 'react';

import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import TagSelect from '../../common/components/TagSelect';
import i18n from '../../common/services/i18n.service';
import { ComponentsStyle } from '../../styles/Components';
import { TouchableOpacity } from 'react-native-gesture-handler';

import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

@inject('hashtag')
@observer
export default class HashtagsStepNew extends Component {

  componentDidMount() {
    this.props.hashtag.setAll(true);
    this.props.hashtag.loadSuggested().catch(err => {
      logService.exception(err);
    });
  }

  getBody = () => {
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={styles.textsContainer}>
          <Text style={[CS.onboardingTitle, CS.marginBottom2x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <Text style={[CS.titleText, CS.colorPrimaryText]}>{i18n.t('onboarding.hashtagTitle')}</Text>
          <Text style={[CS.subTitleText, CS.colorSecondaryText]}>{i18n.t('onboarding.step',{step: 1, total: 4})}</Text>
          <Text style={[
            CS.subTitleText,
            CS.colorSecondaryText,
            CS.marginBottom4x,
            CS.marginTop4x
          ]}>{i18n.t('onboarding.hashtagInterest')}</Text>
        </View>
        <View>
          <TagSelect
            tagStyle={styles.hashtag}
            tagSelectedStyle={styles.tagSelected}
            textSelectedStyle={styles.textSelected}
            textStyle={styles.hashtagText}
            containerStyle={[CS.rowJustifyStart]}
            onTagDeleted={this.props.hashtag.deselect}
            onTagAdded={this.props.hashtag.select}
            tags={this.props.hashtag.suggested}
            disableSort={true}
          />
        </View>
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
  textsContainer: {
    alignItems: 'center',
  },
  hashtag: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#979797',
  },
  hashtagText: {
    color: '#AEB0B8',
    fontSize: 17,
  },
  textSelected: {
    color: '#5DBAC0'
  },
  tagSelected: {
    borderColor: '#5DBAC0'
  }
});