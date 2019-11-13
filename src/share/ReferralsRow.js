import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/MaterialIcons';

import { CommonStyle } from '../styles/Common';
import formatDate from '../common/helpers/date';
import { MINDS_CDN_URI } from '../config/Config';
import ReferralsService from './ReferralsService';

@inject('referrals')
@observer
export default class ReferralsRow extends PureComponent {

  state = {
    selected: false
  }

   /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', { guid: this.props.item.prospect.guid });
    }
  }

  parseDate = (date) => {
    return date ? formatDate(date/1000, 'date', 'Etc/GMT-0') : '';
  }

  getIcontime() {
    return '/' + this.props.item.prospect.icontime;
  }

  /**
   * If date is setted, returns date, otherwise, return button to ping prospect
   * @param {*} item
   * @param {*} color 
   */
  renderJoinDate(item,color) {
    let column;

    if (item.join_timestamp) {
      column = (<Text style={[...color, CommonStyle.fontS, {flex: 3}]}>{this.parseDate(item.join_timestamp)}</Text>);
    } else {
      column = this.renderPingButton();
    }

    return column;
  }

  /**
   * Renders user name and avatar
   * @param {*} item 
   * @param {*} color 
   */
  renderUserName(item,color) {
    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + item.prospect.guid + '/small' + this.getIcontime()};

    return(
      <View>
        <TouchableOpacity onPress={this._navToChannel} style={[{flex: 4}]}>
          <Text style={[...color,  CommonStyle.fontS]}>
            <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
            {item.prospect.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  ping = () => {
    this.props.item.ping();
  }

  renderPingButton() {
    const referral = this.props.item;
    let iconName, color, iconText; 
    if (referral.cantPing()) {
      iconName = 'notifications';
      color = '#aaaaaab3'; //gray
      iconText = 'PINGED';
    } else {
      iconName = 'notifications-active';
      color = '#4890df'; //blue
      iconText = 'PING';
    }
    return (
      <View>
        <TouchableOpacity
            style={[styles.OutlinedButton, {borderColor: color, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}
            activeOpacity = { .5 }
            onPress={this.ping}
        >
          <Icon name={iconName} size={16} color={color} />
          <Text style={[CommonStyle.fontS, {color: color}]}>{iconText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Render
   */
  render() {
    const item = this.props.item;
    const selected = this.state.selected;

    const color = selected ? [CommonStyle.colorBlack, {fontWeight: '800'}] : [CommonStyle.colorDark];

    const userName = this.renderUserName(item,color);
    const joinDate = this.renderJoinDate(item,color);

    return (
      <View>
        <View style={styles.row}>
          <View style={[CommonStyle.rowJustifyStart, CommonStyle.rowJustifyCenter]}>
            <View style={{flex: 5}}>{userName}</View>
            <Text style={[...color, CommonStyle.centered, CommonStyle.fontS, {flex: 2}]}>{item.state}</Text>
            <View style={{flex: 3}}>{joinDate}</View>
          </View>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  smallavatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  avatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  OutlinedButton: {
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15,
    backgroundColor:'#ffffff00',
    borderRadius:25,
    borderWidth: 1,
  },
});
