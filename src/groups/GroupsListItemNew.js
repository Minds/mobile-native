import React, {
  Component
} from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  MINDS_CDN_URI
} from '../config/Config';

import { ListItem, Avatar } from 'react-native-elements';

import colors from '../styles/Colors';
import i18n from '../common/services/i18n.service';
import { CommonStyle as CS } from '../styles/Common';
import { FLAG_JOIN } from '../common/Permissions';
import { StyleSheet } from 'react-native';
import abbrev from '../common/helpers/abbrev';
import ListItemButton from '../common/components/ListItemButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';

export default
@inject('groupView')
@observer
class GroupsListItemNew extends Component {
  /**
   * Render
   */
  render() {
    const button = this.getButton();
    return (
      <ListItem
        containerStyle={styles.container}
        title={this.props.group.name}
        titleStyle={[styles.title, CS.colorPrimaryText]}
        keyExtractor={item => item.rowKey}
        avatar={
          <FastImage
            source={{ uri: this.getAvatar(this.props.group) }}
            style={[{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: 'transparent'
            }]}
          />
        }
        subtitle={i18n.t('groups.listMembersCount', {count: abbrev(this.props.group['members:count'])})}
        subtitleStyle={[styles.subtitle, CS.colorSecondaryText]}
        hideChevron={!button}
        rightIcon={button}
      />
    );
  }

  getAvatar = (group) => {
    return `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large/${group.icontime}`;
  }

  /**
   * On press
   */
  _onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.group)
    }
  }

  /**
   * Get button
   */
  getButton = () => {
    return this.props.group['is:member'] ? this.getLeaveButton() : this.getJoinButton();
  }

  getJoinButton = () => {
    return (
      <ListItemButton onPress={this.join} testID={`suggestedGroup${this.props.index}`}>
        <Icon name="add" size={26} style={CS.colorActionNew} />
      </ListItemButton>
    );
  };

  getLeaveButton = () => {
    return (
      <ListItemButton onPress={this.leave}>
        <Icon name="check" size={26} style={CS.colorDone} />
      </ListItemButton>
    );
  }

  /**
   * Join the group
   */
  join = () => {
    if (!this.props.group.can(FLAG_JOIN, true)) return;
    this.props.groupView.setGroup(this.props.group);
    this.props.groupView.join(this.props.group.guid);
  }
  /**
   * Leave the group
   */
  leave = () => {
    this.props.groupView.setGroup(this.props.group);
    this.props.groupView.leave(this.props.group.guid);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 17,
    fontWeight: '500'
  },
  subtitle: {
    fontSize: 14,
  }
});
