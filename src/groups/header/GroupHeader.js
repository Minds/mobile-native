import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

import {
  observer
} from 'mobx-react/native'

import { Button } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';

import { MINDS_CDN_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';
import Toolbar from '../../common/components/toolbar/Toolbar';
import { CommonStyle } from '../../styles/Common';
import { ComponentsStyle } from '../../styles/Components';

import colors from '../../styles/Colors'

/**
 * Group Header
 */
@observer
export default class GroupHeader extends Component {

  /**
   * Get Group Banner
   */
  getBannerFromGroup() {
    const group = this.props.store.group;
    return MINDS_CDN_URI + 'fs/v1/banners/' + group.guid + '/fat/' + group.icontime;
  }

  /**
   * Get Group Avatar
   */
  getAvatar() {
    const group = this.props.store.group;
    return `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large`;
  }

  /**
   * Get Action Button, Message or Subscribe
   */
  getActionButton() {
    const group = this.props.store.group;
    if (!group['is:owner'] && !group['is:member']) {
      return (
        <TouchableHighlight
          onPress={() => { this.subscribe() }}
          underlayColor='transparent'
          style={ComponentsStyle.bluebutton}
          accessibilityLabel="Subscribe to this group"
        >
          <Text style={{ color: colors.primary }} > JOIN </Text>
        </TouchableHighlight>
      );
    } else {
      <View style={{ width: 40 }}></View>
    }
  }

  subscribe() {
    let group = this.props.store.group;
    this.props.store.groupbe(group.guid);
  }

  renderToolbar() {
    const typeOptions = [
      { text: 'Feed', icon: 'list', value: 'feed' },
      { text: 'Description', icon: 'short-text', value: 'object/video' },
      { text: 'Members', icon: 'ios-people', iconType: 'ion', value: 'user' }
    ]
    return < Toolbar options={ typeOptions } initial = 'feed' onChange = { this.onFilterChange } />
  }

  /**
   * Render Header
   */
  render() {

    const group = this.props.store.group;
    const styles = this.props.styles;
    const avatar = { uri: this.getAvatar() };
    const iurl = { uri: this.getBannerFromGroup() };

    return (
      <View >
        <FastImage source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.headertextcontainer}>
          <View style={styles.countercontainer}>
            <View style={[CommonStyle.columnAlignCenter, CommonStyle.flexContainer]}>
              <Text style={styles.countertitle}>MEMBERS</Text>
              <Text style={styles.countervalue}>{abbrev(group['members:count'], 0)}</Text>
            </View>
            <View style={[CommonStyle.columnAlignCenter, CommonStyle.flexContainer]}>
              <Text style={styles.countertitle}>FEED</Text>
              <Text style={styles.countervalue}>{abbrev(group['activity:count'], 0)}</Text>
            </View>
            <View style={[CommonStyle.columnAlignCenter, CommonStyle.flexContainer]}>
              <Text style={styles.countertitle}>COMMENTS</Text>
              <Text style={styles.countervalue}>{abbrev(group['comments:count'], 0)}</Text>
            </View>
          </View>
          <View style={CommonStyle.rowJustifyCenter}>
            <View style={styles.namecol}>
              <Text style={styles.name}>{group.name.toUpperCase()}</Text>
            </View>
            <View style={styles.buttonscol}>
              {this.getActionButton()}
            </View>
          </View>
        </View>
        {this.renderToolbar()}
        <Image source={avatar} style={styles.avatar} />
      </View>
    )
  }
}
