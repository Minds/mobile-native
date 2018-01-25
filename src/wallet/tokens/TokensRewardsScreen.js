import React, {
  Component
} from 'react';

import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { CommonStyle } from '../../styles/Common';
import JoinView from './JoinView';
import RewardsView from './RewardsView';
import ContributionsView from './ContributionsView';
import Toolbar from '../../common/components/toolbar/Toolbar';
/**
 * Token and Rewards Screen
 */
@inject('user')
@observer
export default class TokensRewardsScreen extends Component {

  static navigationOptions = {
    title: 'Tokens & Rewards'
  }

  state = {
    option: 'rewards'
  }

  /**
   * Render
   */
  render() {
    const hash = this.props.user.me.phone_number_hash;

    const body = this.getBody(hash);

    const options = [
      { text: 'Rewards', icon: 'star', value: 'rewards' },
      { text: 'Contributions', icon: 'history', value: 'contributions' },
    ]

    const toolbar = (hash) ? <Toolbar options={options} initial={this.state.option} onChange={this.onChange} /> : null;

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite, CommonStyle.paddingLeft, CommonStyle.paddingRight]}>
        {toolbar}
        {body}
      </View>
    )
  }

  onChange = (value) => {
    this.setState({
      option: value
    })
  }

  /**
   * Get body
   * @param {string} hash
   */
  getBody(hash) {
    if (hash) {
      switch (this.state.option) {
        case 'rewards':
          return <RewardsView/>
        case 'contributions':
          return <ContributionsView/>
      }
    } else {
      return (
        <JoinView />
      )
    }
  }
}