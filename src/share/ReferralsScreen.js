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

import { Icon } from 'react-native-elements'

import {
  observer,
  inject
} from 'mobx-react/native'

import { CommonStyle } from '../styles/Common';

import i18n from '../common/services/i18n.service';
import settingsService from '../settings/SettingsService';
import settingsStore from '../settings/SettingsStore';
import shareService from "../share/ShareService";
import ReferralsList from './ReferralsList';

/**
 * Token and Rewards Screen
 */
@inject('user')
@observer
export default class ReferralsScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {title: i18n.t('referrals.referralsTitle')}
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite, CommonStyle.padding]}>
        <Text style={[styles.title, styles.textContent]}>{i18n.t('referrals.referralsHowWork')}</Text>
        <Text style={[CommonStyle.fontS, styles.textContent]}>
          {i18n.t('referrals.referralsDescription')}
        </Text>
        <ReferralsList navigation={this.props.navigation} />
        <Icon
          raised
          name="md-share"
          type='ionicon'
          color='#fff'
          size={32}
          containerStyle={ settingsStore.leftHanded ? styles.leftSide : styles.rightSide }
          onPress={() => this.share()}
        />
      </View>
      
    )
  }

  share = () => {
    setTimeout(() => {
      shareService.invite(this.props.user.me.name);
    }, 100); 
  }

}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginTop: 8
  },
  textContent: {
    color: '#444',
    padding: 4
  },
  rightSide: {
    position:'absolute',
    backgroundColor:'#1aaa55',
    width:55,
    height:55,
    bottom:8,
    zIndex:1000,
    right:8
  },
  leftSide: {
    position:'absolute',
    backgroundColor:'#1aaa55',
    width:55,
    height:55,
    bottom:8,
    zIndex:1000,
    left:8
  }
});
