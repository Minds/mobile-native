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
} from 'mobx-react'

import { CommonStyle } from '../../styles/Common';
import JoinView from './JoinView';
import ContributionsView from './contributions/ContributionsView';
import i18nService from '../../common/services/i18n.service';

/**
 * Token and Rewards Screen
 */
@inject('user')
@observer
export default class ContributionsScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {title: i18nService.t('wallet.contributionsTitle')}
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}>
        {this.props.user.me.rewards ? <ContributionsView/> : <JoinView /> }
      </View>
    )
  }

  onChange = (value) => {
    this.setState({
      option: value
    })
  }

}
