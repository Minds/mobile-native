import React, {
  PureComponent
} from 'react';

import {
  StyleSheet,
  View
} from 'react-native';

import { observer, inject } from 'mobx-react/native';

import ThumbUpAction from './actions/ThumbUpAction';
import ThumbDownAction from './actions/ThumbDownAction';
import WireAction from './actions/WireAction';
import CommentsAction from './actions/CommentsAction';
import RemindAction from './actions/RemindAction';
import BoostAction from './actions/BoostAction';

import { CommonStyle } from '../../styles/Common';

@inject('user')
export default class Actions extends PureComponent {

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const isOwner = this.props.user.me.guid === entity.owner_guid;

    return (
      <View style={CommonStyle.flexContainer}>
        <View style={styles.container}>
          <ThumbUpAction entity={entity} me={this.props.user.me}/>
          <ThumbDownAction entity={entity} me={this.props.user.me}/>
          {!isOwner && <WireAction entity={entity} navigation={this.props.navigation}/>}
          <CommentsAction entity={entity} navigation={this.props.navigation}/>
          <RemindAction entity={entity}/>
          {isOwner && <BoostAction entity={entity} navigation={this.props.navigation}/>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});
