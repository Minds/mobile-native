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

import Button from '../common/components/Button';
import colors from '../styles/Colors';
import i18n from '../common/services/i18n.service';

@inject('groupView')
@observer
export default class GroupsListItem extends Component {
  /**
   * Render
   */
  render() {
    const button = this.getButton();
    return (
      <ListItem
        containerStyle={{ borderBottomWidth: 0 }}
        title={this.props.group.name}
        keyExtractor={item => item.rowKey}
        avatar={
          <Avatar
            width={42}
            height={42}
            rounded
            source={{ uri: MINDS_CDN_URI + 'fs/v1/avatars/' + this.props.group.guid + '/small/' + this.props.group.icontime }}
          />
        }
        subtitle={i18n.t('groups.listMembersCount', {count: this.props.group['members:count']})}
        onPress={this.props.onPress}
        hideChevron={!button}
        rightIcon={button}
      />
    );
  }

  /**
   * Get button
   */
  getButton = () => {
    return this.props.group['is:member'] ?
      <Button text="Leave" onPress={this.leave} color={colors.darkGreyed}/> :
      <Button text="Join" onPress={this.join} color={colors.darkGreyed}/>
  }

  /**
   * Join the group
   */
  join = () => {
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



