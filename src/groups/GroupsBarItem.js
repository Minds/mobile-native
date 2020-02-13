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
import navigationService from '../navigation/NavigationService';

@inject('groupsBar')
@observer
export default class GroupsBarItem extends Component {

  /**
   * Get Group Avatar
   */
  getAvatar(group) {
    return `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large/${group.icontime}`;
  }

  navToGroup = () => {
    navigationService.navigate('GroupView', {group: this.props.group});
  }

  render() {
    const group = this.props.group;
    if (group['marker_gathering-heartbeat']) {
      return (
        <View style={[CS.columnAlignCenter, styles.container, CS.backgroundTransparent, CS.centered]}>
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
          <Text style={[CS.fontXS, CS.marginTop, CS.fontMedium]}>
            {excerpt(group.name, 11)}
          </Text>
          {group.marker_conversation ? <FAIcon name="circle" size={12} color='rgba(70, 144, 223, 1)' style={styles.unread} /> : null}
        </View>
      )
    }
    return (
      <View style={[CS.columnAlignCenter, styles.container, CS.backgroundTransparent, CS.centered]}>
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
    padding:10,

    overflow: 'visible'
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
    top: Platform.OS == 'ios' ? 8 : 6,
    left: Platform.OS == 'ios' ? 8 : 6
  },
})