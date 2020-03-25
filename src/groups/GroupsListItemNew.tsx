import React, {Component} from 'react';

import {observer, inject} from 'mobx-react';

import {MINDS_CDN_URI} from '../config/Config';

import {ListItem} from 'react-native-elements';

import Button from '../common/components/Button';
import colors from '../styles/Colors';
import i18n from '../common/services/i18n.service';
import {CommonStyle as CS} from '../styles/Common';
import {FLAG_JOIN} from '../common/Permissions';
import { StyleSheet } from 'react-native';
import ListItemButton from '../common/components/ListItemButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import abbrev from '../common/helpers/abbrev';

export default
@inject('groupView')
@observer
class GroupsListItemNew extends Component {
  state = {
    source: null,
  };

  /**
   * Derive state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.group && prevState.group !== nextProps.group) {
      return {
        source: {
          rounded: true,
          size: 45,
          source: {
            uri:
              MINDS_CDN_URI +
              'fs/v1/avatars/' +
              nextProps.group.guid +
              '/small/' +
              nextProps.group.icontime,
          },
        },
      };
    }

    return null;
  }

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
        leftAvatar={this.state.source}
        subtitle={i18n.t('groups.listMembersCount', {count: abbrev(this.props.group['members:count'])})}
        subtitleStyle={[styles.subtitle, CS.colorSecondaryText]}
        onPress={this._onPress}
        hideChevron={!button}
        rightIcon={button}
      />
    );
  }

  /**
   * On press
   */
  _onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.group);
    }
  };

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
  };
  /**
   * Leave the group
   */
  leave = () => {
    this.props.groupView.setGroup(this.props.group);
    this.props.groupView.leave(this.props.group.guid);
  };
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
