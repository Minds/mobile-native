import React, {
  Component
} from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {
  MINDS_CDN_URI
} from '../config/Config';

import colors from '../styles/Colors';
import {CommonStyle as CS} from '../styles/Common';
import FastImage from 'react-native-fast-image';
import PulseAnimAvatar from '../common/components/PulseAnimAvatar';
import excerpt from '../common/helpers/excerpt';
import socketService from '../common/services/socket.service';
import navigationService from '../navigation/NavigationService';

@inject('groupsBar')
@observer
export default class GroupsBarItem extends Component {

  componentDidMount() {
    socketService.join(`marker:${this.props.group.guid}`);
    socketService.subscribe(`marker:${this.props.group.guid}`, this.handleMessage);
  }

  componentWillUnmount() {
    socketService.unsubscribe(`marker:${this.props.group.guid}`, this.handleMessage)
    socketService.leave(`marker:${this.props.group.guid}`);
  }

  handleMessage = (marker) => {
    this.props.groupsBar.handleMarker(JSON.parse(marker))
  }

  /**
   * Get Group Avatar
   */
  getAvatar(group) {
    return `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large/${group.icontime}`;
  }

  navToGroup = () => {
    navigationService.push('GroupView', {group: this.props.group});
  }

  render() {
    const group = this.props.group;
    if (group['marker_gathering-heartbeat']) {
      return (
        <View style={[CS.columnAlignCenter, CS.marginRight2x]}>
          <View>
            <PulseAnimAvatar
              avatar={this.getAvatar(group)}
              size={60}
              pulseMaxSize={80}
              borderColor={colors.danger}
              backgroundColor={colors.danger}
              interval={1000}
              onPress={this.navToGroup}
            />
            {group.marker_activity ? <View style={styles.acitivity}/> : null}
          </View>
          <Text style={[CS.fontXS, CS.marginTop, CS.fontMedium]}>{excerpt(group.name, 11)}</Text>
          {group.marker_conversation ? <FAIcon name="circle" size={12} color='rgba(70, 144, 223, 1)' style={styles.unread} /> : null}
        </View>
      )
    }
    return (
      <View style={[CS.columnAlignCenter, styles.container, CS.marginRight2x, CS.backgroundTransparent]}>
        <TouchableOpacity onPress={this.navToGroup} activeOpacity={.5}>
          <FastImage source={{uri: this.getAvatar(group)}} style={[styles.avatar]}/>
          {group.marker_activity ? <View style={[styles.acitivity]}/> : null}
        </TouchableOpacity>
        <Text style={[CS.fontXS, CS.marginTop, CS.fontMedium]}>{excerpt(group.name, 11)}</Text>
        {group.marker_conversation ? <FAIcon name="circle" size={12} color='rgba(70, 144, 223, 1)' style={styles.unread} /> : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding:3
  },
  acitivity: {
    zIndex: 9990,
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderWidth: 1.5,
    borderRadius: 34,
    position: 'absolute',
    borderColor: colors.primary
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: Platform.OS == 'ios' ? -2 : 0,
    left: Platform.OS == 'ios' ? 4 : 2
  },
})