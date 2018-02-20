import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  TouchableHighlight,
} from 'react-native';

import {
  observer
} from 'mobx-react/native'

import FastImage from 'react-native-fast-image';

import { MINDS_CDN_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';
import Toolbar from '../../common/components/toolbar/Toolbar';
import { CommonStyle } from '../../styles/Common';
import { ComponentsStyle } from '../../styles/Components';
import CenteredLoading from '../../common/components/CenteredLoading';

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
    const store = this.props.store;
    const group = store.group;

    if (store.saving) return <CenteredLoading />;

    if (!group['is:member']) {
      return (
        <TouchableHighlight
          onPress={() => { store.join(group.guid) }}
          underlayColor='transparent'
          style={ComponentsStyle.bluebutton}
          accessibilityLabel="Subscribe to this group"
          disabled={store.saving}
        >
          <Text style={CommonStyle.colorPrimary} ref="btntext"> JOIN </Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          onPress={() => { store.leave(group.guid)  }}
          underlayColor='transparent'
          style={ComponentsStyle.bluebutton}
          accessibilityLabel="Subscribe to this group"
          disabled={store.saving}
        >
          <Text style={CommonStyle.colorPrimary} ref="btntext"> LEAVE </Text>
        </TouchableHighlight>
      );
    }
  }

  /**
   * Render Tabs
   */
  renderToolbar() {
    const typeOptions = [
      { text: 'FEED', icon: 'list', value: 'feed' },
      { text: 'DESCRIPTION', icon: 'short-text', value: 'desc' },
      { text: 'MEMBERS', icon: 'ios-people', iconType: 'ion', value: 'members' }
    ]
    return (
      <Toolbar
        options={ typeOptions }
        initial={ this.props.store.tab }
        onChange={ this.onTabChange }
      />
    )
  }

  /**
   * On tab change
   */
  onTabChange = (tab) => {
    const group = this.props.store.group;
    this.props.store.setFilter(tab);
    switch (tab) {
      case 'feed':
        // clear list without mark loaded flag
        this.props.store.refresh(group.guid);
      case 'desc':
        // clear list without mark loaded flag
        this.props.store.list.clearList(false);
        break;
      case 'members':  
        this.props.store.loadMembers();
        break;
      default:
        break;
    }

    this.props.store.setTab(tab);
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
        <Image source={avatar} style={styles.avatar} />
        {this.renderToolbar()}
      </View>
    )
  }
}
