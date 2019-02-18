import React, { Component } from 'react';

import {
  View,
  Text,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import colors from '../../styles/Colors';
import { ListItem } from 'react-native-elements';

@inject('hashtag', 'onboarding')
@observer
export default class WelcomeStep extends Component {

  /**
   * Component did mount
   */
  componentWillMount() {
    this.props.hashtag.setAll(true);
    this.props.hashtag.loadSuggested().catch(e => {
      console.log(e);
    });
  }

  setFrequency = async(value) => {
    await this.props.onboarding.setFrequency(value);
    this.props.onNext();
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CS.padding4x]}>
        <Text style={[CS.fontXXXL, CS.colorDark, CS.fontMedium, CS.marginBottom3x]}>Welcome to Minds!</Text>
        <Text style={[CS.fontL, CS.colorDark, CS.fontMedium, CS.marginBottom3x, CS.fontLight]}>Before you get started, there are a few things we need to provide you with the best experience.</Text>
        <Text style={[CS.fontL, CS.colorDark, CS.fontMedium, CS.marginBottom3x, CS.fontLight]}>First off, how often do you post to social media?</Text>

        <View>
          <ListItem
            title="Rarely"
            titleStyle={[CS.fontXL, {marginLeft: 0, paddingLeft: 0}]}
            containerStyle={[CS.borderBottomHair, {paddingLeft:0, marginLeft:0}]}
            chevronColor={colors.primary}
            onPress={() => this.setFrequency('rarely')}
            noBorder
          />
          <ListItem
            title="Sometimes"
            titleStyle={{marginLeft: 0, paddingLeft: 0}}
            containerStyle={[CS.borderBottomHair, {paddingLeft:0, marginLeft:0}]}
            chevronColor={colors.primary}
            onPress={() => this.setFrequency('sometimes')}
            noBorder
          />
          <ListItem
            title="Frequently"
            titleStyle={{marginLeft: 0, paddingLeft: 0}}
            containerStyle={[CS.noBorderBottom, {paddingLeft:0, marginLeft:0}]}
            chevronColor={colors.primary}
            onPress={() => this.setFrequency('frequently')}
            noBorder
          />
        </View>
      </View>
    );
  }
}